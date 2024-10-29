<?php 

// SQL stuff
include_once("sql.php");

function item_existsSQL($id) {
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
	
	// Prepare the Query
	$where_condition = "WHERE P.product_id = $id";
	
	// This is the Query to show everything
	$query_input = "SELECT * FROM $sql_item_table $where_condition;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	$query_resultn = mysqli_num_rows($query_result);
	
	$item = null;
	
	while ($record = mysqli_fetch_assoc($query_result)) {
		$item = array_map();
		$item["id"] = $record["product_id"];
		$item["name"] = $record["name"];
		$item["desc"] = $record["description"]; 
		$item["price"] = $record["price"];
		$item["stock"] = $record["stock"];
	}
	
	mysqli_close($sqli);
	return $item;
}

// Get the item information
function item_fetch($item_id) {
	if (!isset($item_id)) {
		// Don't print anything, tell to find an actual item
		echo "{}";
	} else {
		// Check if it exists in the SQL
		$item = item_existsSQL($item_id);
		
		if ($item == null) {
			// Don't print anything, tell to find an actual item
			echo "{}";
		} else {
			$item_id = $item["id"];
			$item_name = $item["name"];
			$item_desc = $item["desc"];
			$item_price = $item["price"];
			$item_stock = $item["stock"];
			
			echo "{ \"id\": \"$item_id\",";
			echo "\"name\": \"$item_name\",";
			echo "\"desc\": \"$item_desc\",";
			echo "\"price\": $item_price,";
			echo "\"stock\": $item_stock }";
		}
	}
}

// Create an element 
function item_create($name, $category, $description, $price, $stock) {
	if ($price <= 0.00 || !isset($price)) {
		return;
	}
	if ($stock < 0 || !isset($stock)) {
		return;
	}
	
	// Edit strings 
	if ($name == null || strlen($name) < 1) {
		return;
	} else {
		$name = "'$name'";
	}
	if ($category == null || strlen($category) < 1) {
		return;
	} else {
		$category = "'$category'";
	}
	if ($description == null || strlen($description) < 1) {
		$description = "null";
	} else {
		$description = "'$description'";
	}
	
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
	
	// Prepare the Query
	//$where_condition = "WHERE P.product_id = $id";
	
	// This is the Query to show everything
	$query_input = "INSERT INTO $sql_item_table (name, category, price, stock) VALUES ($name, $category, $price, $stock);";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	mysqli_close($sqli);
}

// Change the item 
function item_change($id, $name, $category, $description, $price, $stock) {
	if ($price <= 0.00) {
		return;
	}
	if ($stock < 0) {
		return;
	}
	
	// Edit strings 
	if ($name == null || strlen($name) < 1) {
		return;
	} else {
		$name = "'$name'";
	}
	if ($category == null || strlen($category) < 1) {
		return;
	} else {
		$category = "'$category'";
	}
	if ($description == null || strlen($description) < 1) {
		$description = "null";
	} else {
		$description = "'$description'";
	}
	
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
	
	// Prepare the Query
	$where_condition = "WHERE P.product_id = $id";
	$set_cond = "SET ";
	
	$set_cond = $set_cond . "P.name = $name,"; 
	$set_cond = $set_cond . "P.category = $category,";
	$set_cond = $set_cond . "P.description = $description,";
	$set_cond = $set_cond . "P.price = $price,";
	$set_cond = $set_cond . "P.stock = $stock";
	
	// This is the Query to show everything
	$query_input = "UPDATE $sql_item_table $set_cond $where_condition;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	mysqli_close($sqli);
	
}

// Delete the item 
function item_delete($id) {
	
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
	
	// Prepare the Query
	$where_condition = "WHERE P.product_id = $id";
	
	// This is the Query to show everything
	$query_input = "DELETE FROM $sql_item_table $where_condition;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	mysqli_close($sqli);
}

// Get the ID 

// Before we do anything reguarding the HTML.
$item_id = sql_removeProblemChars($_GET["id"]);
$item_action = $_GET["action"];

// Before we do anything reguarding the HTML.
if ($item_action == "get") {
	item_fetch($item_id);
} 
// If we're logged in correctly.
else {
	// Delete 
	if ($item_action == "delete") {
		item_delete($item_id);
		echo "{}";
	} 
	// These need some sort of information 
	else {
		// Get the name of the item 
		$name = sql_removeProblemChars($_GET["name"]);
		$category = sql_removeProblemChars($_GET["category"]);
		$description = sql_removeProblemChars($_GET["description"]);
		$price = sql_removeProblemChars($_GET["price"]);
		$stock = sql_removeProblemChars($_GET["stock"]);
	
		if ($item_action == "create" && isset($name) && isset($category) && isset($price) && isset($stock)) {
			//echo "$name $category $price $stock";
			item_create($name, $category, $description, $price, $stock);
			echo "{}";
		} else if ($item_action == "edit") {
			item_change($item_id, $name, $category, $description, $price, $stock);
			item_fetch($item_id);
		}
	}
}


?>