<?php

// Include important things
include_once("sql.php");
include_once("user-head.php");
include_once("item-head.php");
include_once("catalog-head.php");

// Returns index of item
function cart_isIn($items, $item) {
	// Print 
	$itemsn = sizeof($items);
	
	// Loop all items
	for ($i = 0; $i < $itemsn; $i++) {
		// If the IDs are the same 
		$dbItem = $items[$i];
		
		$id = (int)$item["id"];
		$id_type = gettype($id);
		
		$cid = (int)$dbItem["id"];
		$cid_type = gettype($cid);
		//echo "<p> $id_type($id) -> $cid_type($cid)</p>";
		
		
		if ($id == $cid) {
			return $i;
		}
	}
	
	return -1;
}

// Modify stock 
function cart_modifyStock($sqli, $sql_item_table, $items, $cart) {
	// For all items in the cart...
	for ($i = 0; $i < sizeof($cart); $i++) {
		// Get the current amount...
		$cart_item = $cart[$i];
		$id = $cart_item["id"];
		$dbIndex = cart_isIn($items, $cart_item);
		
		// If value exists.
		if ($dbIndex != -1) {
			// Make new amount
			$db_item = $items[$dbIndex];
			$set_amount = ($db_item["stock"] - $cart_item["amount"]);
			
			// Create an SQL query for it 
			$conditions = "SET P.stock = $set_amount WHERE P.product_id = $id";
			
			// If where condition has nothing.
			$query_input = "UPDATE $sql_item_table $conditions;";
	
			// Input the query
			$query_result = mysqli_query($sqli, $query_input);
		}
	}	
}

// Add as an order 
function cart_addOrder($sqli, $sql_order_table, $items, $cart) {
	// Get the user 
	$user_login = json_decode(ltrim(urldecode($_COOKIE["cs_ulog"]), '%'), true);
	$user_id = $user_login["id"];
	
	// For all the items in 
	for ($i = 0; $i < sizeof($cart); $i++) {
		// Get cart items
		$cart_item = $cart[$i];
		$cart_id = $cart_item["id"];
		$cart_amount = $cart_item["amount"];
		
		$time_now = time();
		
		// Create an SQL query for it 
		$conditions = "VALUES ($user_id, $cart_id, $cart_amount, 'confirmed')";
		
		// If where condition has nothing.
		$query_cols = "(user_id, product_id, quantity, order_status)";
		$query_input = "INSERT INTO $sql_order_table $query_cols $conditions;";
		//echo $query_input;
		
		// Input the query
		$query_result = mysqli_query($sqli, $query_input);
	}
}

// Add order info into the db 
function cart_updateDB($items, $cart) {
	// Decrement all cart items
	// Add order into DB
	
	// Get login in an array
	$sql_login = sql_login();
	$sql_host = $sql_login[0];
	$sql_user = $sql_login[1];
	$sql_pass = $sql_login[2];
	$sql_dbname = $sql_login[3];
	
	// Open connection
	$sqli = mysqli_connect($sql_host, $sql_user, $sql_pass, $sql_dbname);
	if (mysqli_connect_error()) {
		echo "No Connection (" . mysqli_connect_error() . ": " . mysqli_connect_errno() . ")!<br/>";
		die("No Connection.");
		return;
	}
	
	// These are important names for the database.
	$sql_item_table = "$sql_user.products P";
	$sql_order_table = "$sql_user.orders";
	
	// For all items in the cart...
	cart_modifyStock($sqli, $sql_item_table, $items, $cart);
	
	// Put all into array
	cart_addOrder($sqli, $sql_order_table, $items, $cart);
	
	// Close SQL connection
	mysqli_close($sqli);
	return $arr;
}

// Check if valid
function cart_check($items, $cart) {
	// All cart items
	$cartn = sizeof($cart);
	
	// For all items in the shopping cart, check if it is in the query
	for ($i = 0; $i < $cartn; $i++) {
		// If the id is in the cart
		$cart_item = $cart[$i];
		$item_quantity = $cart_item["amount"];
		
		// Get the index of the array
		$index = cart_isIn($items, $cart_item);
		
		// If Index exists
		if ($index != -1) {
			// If the quantity we want
			$dbItem = $items[$index];
			$item_stock = $dbItem["stock"];
			
			// If not a good quantity 
			if ($item_stock < $item_quantity) {
				return false;
			}
		}
	}
	return true;
}

// Sum up the price...
function cart_getPrice($items, $cart) {
	// All cart items
	$cartn = sizeof($cart);
	$cost = 0;
	
	// For all items in the shopping cart, check if it is in the query
	for ($i = 0; $i < $cartn; $i++) {
		// If the id is in the cart
		$cart_item = $cart[$i];
		$item_quantity = $cart_item["amount"];
		
		// Get the index of the array
		$index = cart_isIn($items, $cart_item);
		
		// If Index exists
		if ($index != -1) {
			// If the quantity we want
			$dbItem = $items[$index];
			
			// Otherwise add it to the price
			$item_price = $dbItem["price"];
			$cost += ($item_price * $item_quantity);
			//echo "<p>[" . $cart_item["id"] . "=" . $dbItem["id"] . "]: $cost += $item_price * $item_quantity</p>";
		}
	}
	return $cost;
}

function cart_exec() {
	// Get user details 
	$user_login = json_decode(ltrim(urldecode($_COOKIE["cs_ulog"]), '%'), true);
	
	// If user ID is valid
	$user_id = $user_login["id"];
	$user_un = $user_login["username"];
	$user_pw = $user_login["password"];
	
	// Check every item.
	$items = catalog_all();
	
	// If exists 
	$valid_login = user_exists($user_id, $user_pw);
	if ($valid_login) {
		// Accept the request, read the shopping cart 
		$cart = json_decode($_COOKIE["cs_shoppingcart"], true);
		
		// Get values
		$valid = cart_check($items, $cart);
		// Not valid? End the function
		if (!$valid || $cart == null || sizeof($cart) < 1) {
			echo "{ \"success\": 0, \"cost\": null }";
			return;
		}
		
		// Calculate cost
		$cost = cart_getPrice($items, $cart);
		
		// Update the database
		cart_updateDB($items, $cart);
		
		echo "{ \"success\": 1, \"cost\": $cost }";
		return;
	} else {
		echo "{ \"success\": 0 }";
	}
}

cart_exec();

?>