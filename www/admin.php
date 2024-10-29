<?php

//ini_set('display_errors', '1');
//ini_set('display_startup_errors', '1');
//error_reporting(E_ALL);

// SQL stuff
include_once("sql.php");
include_once("user.php");

// Create one product 
function admin_create($name, $category, $description, $price, $stock) {
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
	$sql_item_table = "$sql_user.products";
	
	// This is the Query to show everything
	$query_input = "INSERT INTO $sql_item_table (name, category, description, price, stock) VALUES ('$name', '$category', '$description', $price, $stock);";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	mysqli_close($sqli);
}

// Edit a product
function admin_edit($id, $name, $category, $description, $price, $stock) {
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
	
	// This is the Query to show everything
	$update_vals = "";
	if ($name != null) {
		$update_vals = $update_vals . " P.name = '$name'";
	}
	if ($category != null) { 
		if (strlen($update_vals) > 0) {
			$update_vals = $update_vals . ',';
		}
		$update_vals = $update_vals . " P.category = '$category'";
	}
	if ($description != null) { 
		if (strlen($update_vals) > 0) {
			$update_vals = $update_vals . ',';
		}
		$update_vals = $update_vals . " P.description = '$description'";
	}
	if ($price != null) { 
		if (strlen($update_vals) > 0) {
			$update_vals = $update_vals . ',';
		}
		$update_vals = $update_vals . " P.price = $price";
	}
	if ($stock != null) { 
		if (strlen($update_vals) > 0) {
			$update_vals = $update_vals . ',';
		}
		$update_vals = $update_vals . " P.stock = $stock";
	}
	
	$where_cond = "P.product_id = $id";
	$query_input = "UPDATE $sql_item_table SET $update_vals WHERE $where_cond;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	mysqli_close($sqli);
}

// Delete one product 
function admin_delete($id) {
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
	
	// This is the Query to show everything
	$query_input = "DELETE FROM $sql_item_table WHERE P.product_id = $id";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	mysqli_close($sqli);
}

// If it is a valid admin acc 
function admin_valid($id, $pw) {
	// If user doesn't exist.
	if (!user_exists($id, $pw)) {
		return false;
	}
	
	// Get the user 
	$user = user_get($id);
	$utype = $user["type"];
	
	// If the user is a staff member
	return ($utype == "staff");
}

function admin_exec() {
	// Get the params
	$id = (int)sql_removeProblemChars($_GET["id"]);
	$action =  sql_removeProblemChars($_GET["action"]);	// Say aayyyyyy fuck tomorrow!
	
	// If no action AND no id
	if (!is_numeric($id) || !is_string($action) || strlen($action) < 1) {
		// Do not continue.
		return;
	}
	
	// Check if the user login is good 
	$user_log = json_decode($_COOKIE["cs_ulog"], true);
	$user_id = $user_log["id"];
	$user_pw = $user_log["password"];
	$user = admin_valid($user_id, $user_pw);
	
	// If user is null return 
	//echo "$user_id, $user_pw, $user";
	if (!$user) {
		return;
	}

	// Check if action is good
	if ($action != "create" && $action != "edit" && $action != "delete") {
		return;
	}
		
	// We can assume the id and action is good
	if ($action == "delete") {
		// Delete a product.
		admin_delete($id);
	} else {
		
		// Get the values specific to this 
		$is_id = isset($id);
		
		$name = sql_removeProblemChars($_GET["name"]);
		$is_name = isset($name);
		
		$category = sql_removeProblemChars($_GET["cat"]);
		$is_category = isset($category);
		
		$description = sql_removeProblemChars($_GET["desc"]);
		$is_description = isset($description);
		
		$price = (float)sql_removeProblemChars($_GET["price"]);
		$is_price = isset($price) && is_float($price);
		
		$stock = (int)sql_removeProblemChars($_GET["stock"]);
		$is_stock = isset($stock) && is_numeric($stock);
		
		// If all exist 
		$all_values = ( $is_name && $is_category && $is_description && $is_price && $is_stock );
		$one_value =  ( $is_name || $is_category || $is_description || $is_price || $is_stock );
		
		//echo "($is_id, $is_name, $is_category, $is_description, $is_price, $is_stock) $all_values, $one_value, $action";
		
		if ($action == "create" && $all_values) {
			// Create the product
			admin_create($name, $category, $description, $price, $stock);
		} else if ($action == "edit" && $is_id && $one_value) {
			/// Edit a product
			admin_edit($id, $name, $category, $description, $price, $stock);
		}
	} 
}

admin_exec();


?>