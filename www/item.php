<?php 

// Get the login
function item_sqlLogin() {
	// CSV File 
	$file = fopen("../../assignment-2/sql.csv", 'r');
	
	$login = array_map();
	while ($record = fgetcsv($file, 1000, ',')) {
		// Get the values
		$login[0] = $record[0];
		$login[1] = $record[1];
		$login[2] = $record[2];
		$login[3] = $record[3];
	}
	
	// Close file stream
	fclose($file);
	
	return $login;
}

function item_existsSQL($id) {
	// Get login in an array
	$sql_login = item_sqlLogin();
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
	$sql_item_table = "products P";
	
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
function item_fetch() {
	// Before we do anything reguarding the HTML.
	$item_id = $_GET["id"];
	if (!isset($_GET["id"])) {
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

// Before we do anything reguarding the HTML.
item_fetch();

?>