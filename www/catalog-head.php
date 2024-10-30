<?php

// Get unique catergories 
function catalog_getUniqueCategories($sqli) {
	// Loop all values 
	$unique_cats = [];
	
	// Input the query
	$query_result = mysqli_query($sqli, "SELECT * FROM products;");
	while ($record = mysqli_fetch_assoc($query_result)) {
		// The catergory of the item
		$item_catergory = $record["category"];
		// If not in, add into the array
		if (!in_array($item_catergory, $unique_cats, true)) {
			array_push($unique_cats, $item_catergory);
		}
	}
	
	return $unique_cats;
}

// Add item to echo 
function catalog_printItem($record) {
	echo "{ \"id\":" . $record["product_id"] . ",";
	echo "\"name\":\"" . $record["name"] . "\",";
	echo "\"desc\":\"" . $record["description"] . "\","; 
	echo "\"category\":\"" . $record["category"] . "\","; 
	echo "\"price\":" . $record["price"] . ","; 
	echo "\"stock\":" . $record["stock"];
	echo "}";
}

// Add to items to echo 
function catalog_printItems($query_result) {
	$i = 0;
	$query_resultn = mysqli_num_rows($query_result);
	while ($record = mysqli_fetch_assoc($query_result)) {
		// The catergory of the item
		$item_catergory = $record["category"];
		
		// Print the item, if it matches
		catalog_printItem($record);
		
		// If not last, place a comma
		if ($i < $query_resultn - 1) {
			echo ",";
		}
		
		$i++;
	}
}

// Add all catergories to echo 
function catalog_printCategories($unique_cats) {
	// Copy all the catergories. 
	$item_n = sizeof($unique_cats);
	for ($i = 0; $i < $item_n; $i++) {
		// Print into the json
		echo "\"";
		echo $unique_cats[$i];
		echo "\"";
		
		// If we're not the last item
		if ($i < $item_n - 1) {
			echo ',';
		}
	}
}

// Add all functions 
function catalog_print($sqli, $query_result) {
	echo "{\"items\": [";
	catalog_printItems($query_result);
	
	echo "],\"categories\":[";
	// Get unique catergories
	$unique_cats = catalog_getUniqueCategories($sqli);
	catalog_printCategories($unique_cats);
	echo "]}";
}


// Try the query login
function catalog_query($input_name, $input_cat) {
	// Get login in an array
	$sql_login = sql_login();
	$sql_host = $sql_login[0];
	$sql_user = $sql_login[1];
	$sql_pass = $sql_login[2];
	$sql_dbname = $sql_login[3];
	
	//echo $sql_host;
	//echo $sql_user;
	//echo $sql_pass;
	//echo $sql_dbname;
	
	
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
	$where_condition = "";
	if ($input_name != NULL) {
		// Add name
		$name_condition = "LOWER(P.name) LIKE LOWER('%$input_name%')";
		
		// Add description
		$desc_condition = "LOWER(P.description) LIKE LOWER('%$input_name%')";
		
		// Add a catergory
		$catergory_condition = "LOWER(P.category) LIKE LOWER('%$input_name%')";
		
		// Form end query
		$where_condition = "(($name_condition) OR ($desc_condition) OR ($catergory_condition))";
	}
	
	if ($input_cat != NULL) {
		if (strlen($where_condition) > 1) {
			$where_condition = "$where_condition AND";
		}
		$where_condition = "$where_condition (LOWER(P.category) LIKE LOWER('$input_cat'))";
	}
	
	// If where condition has nothing.
	$query_input = "SELECT * FROM $sql_item_table;";
	if (strlen($where_condition) > 1) {
		// This is the Query to show everything
		$query_input = "SELECT * FROM $sql_item_table WHERE $where_condition;";
	}
	
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	// Print results
	catalog_print($sqli, $query_result);
	
	// Close SQL connection
	mysqli_close($sqli);
	
}

// Try the query login
function catalog_all() {
	// Get login in an array
	$sql_login = sql_login();
	$sql_host = $sql_login[0];
	$sql_user = $sql_login[1];
	$sql_pass = $sql_login[2];
	$sql_dbname = $sql_login[3];
	
	//echo $sql_host;
	//echo $sql_user;
	//echo $sql_pass;
	//echo $sql_dbname;
	
	
	// Open connection
	$sqli = mysqli_connect($sql_host, $sql_user, $sql_pass, $sql_dbname);
	if (mysqli_connect_error()) {
		echo "No Connection (" . mysqli_connect_error() . ": " . mysqli_connect_errno() . ")!<br/>";
		die("No Connection.");
		return;
	}
	
	// These are important names for the database.
	$sql_item_table = "products P";
	
	// If where condition has nothing.
	$query_input = "SELECT * FROM $sql_item_table;";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	$query_resultn = mysqli_num_rows($query_result);
	
	// Return array 
	$template = array_map(
		["id", "name", "category", "description", "price", "stock"],
		[null, null, null, null, null, null]);
	
	$arr = array_fill(0, $query_resultn, $template);
	
	// Put all into array
	$i = 0;
	while ($record = mysqli_fetch_assoc($query_result)) {
		$arr[$i]["id"] = $record["product_id"];
		$arr[$i]["name"] = $record["name"];
		$arr[$i]["category"] = $record["category"];
		$arr[$i]["description"] = $record["description"];
		$arr[$i]["price"] = $record["price"];
		$arr[$i]["stock"] = $record["stock"];
		
		$i++;
	}
	
	// Close SQL connection
	mysqli_close($sqli);
	return $arr;
	
}











// This is the function everything stems from
function catalog_run() {
	// Set the query to be compatible
	$item_query = null;
	$item_cat = null;
	
	if (isset($_GET["q"])) {
		$item_query = $_GET["q"];
		$item_query = sql_removeProblemChars($item_query);
	}
	
	// Get the catergory 
	if (isset($_GET["cat"])) {
		$item_cat = $_GET["cat"];
		$item_cat = sql_removeProblemChars($item_cat);
	}
	
	// Run the JSON
	catalog_query($item_query, $item_cat);
}

?>