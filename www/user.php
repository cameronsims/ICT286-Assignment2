<?php 

// SQL stuff
include "sql.php";

// Check if the user id and pw are correct, true if so, false if not 
function user_exists($user_id, $user_pw) {
	return false;
}

// Create a session with the user 
function user_sessionStart($user_id) {
	// Set the session to the be the user IDs 
	$_SESSION['uid'] = $user_id;
}


// Get the user from DB 
function user_get($user_id = null, $user_name = null) {
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
	$sql_item_table = "$sql_user.users U";
	
	// Prepare the Query
	$where_condition = "WHERE U.user_id = $user_id";
	if ($user_id == null && $user_name != null) {
		$where_condition = "WHERE U.username LIKE '$user_name'";
	}
	
	// This is the Query to show everything
	$query_input = "SELECT * FROM $sql_item_table $where_condition;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	$item = null;
	while ($record = mysqli_fetch_assoc($query_result)) {
		$item = array_map();
		$item["id"] = $record["user_id"];
		$item["password"] = $record["password"];
		$item["username"] = $record["username"];
		$item["type"] = $record["user_type"];
		$item["name"] = $record["name"];
		$item["address"] = $record["address"];
		$item["phone"] = $record["phone"];
		$item["email"] = $record["email"];
	}
	
	
	mysqli_close($sqli);
	return $item;
}

// Print the user 
function user_print($user_id) {
	// Get the user 
	$user = user_get($user_id);
	
	// Create a hashmap
	$keys = [ "id", "username", "type", "name", "address", "phone", "email" ];
	$values = [ "id", "username", "type", "name", "address", "phone", "email" ];
	
	// Print into the response 
	echo '{';
	for ($i = 0; $i < sizeof($keys); $i++) {
		// Echo to response
		$key =  $keys[$i];
		$val = $user[$values[$i]];
		
		echo "\"$key\":";
		 
		if ($val != null) {
			// IF value is a numeric
			if (is_numeric($val)) {
				echo "$val";
			} else {
				echo "\"$val\"";
			}
		} else {
			echo "null";
		}
		
		if ($i < sizeof($keys) -1) {
			echo ",";
		}
	}
	echo '}';
}

// Login user 
function user_login($user_id, $user_pw) {
	// Set the cookie and session for the user
	$user = user_get($user_id);
	
	// If user is null 
	if ($user == null) {
		return false;
	}
	
	// Check if password is also correct
	if (md5($user_pw) == $user["password"]) {
		return true;
	}
	
	return false;
}

// Change user data 
function user_change($user_id, $user_fname, $user_address, $user_phone, $user_email) {
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
	$sql_item_table = "$sql_user.users U";
	
	$set_cond = "";
	$set_exists = false;
	
	if (isset($user_fname)) {
		// Add name value
		$set_cond = "U.name = '$user_fname'";
		$set_exists = true;
	}
	if (isset($user_address)) {
		// ADD an AND
		if ($set_exists) {
			$set_cond = $set_cond . ", ";
		}
		$set_cond = $set_cond . "U.address = '$user_address'";
		$set_exists = true;
	}
	if (isset($user_email)) {
		// ADD an AND
		if ($set_exists) {
			$set_cond = $set_cond . ", ";
		}
		$set_cond = $set_cond . "U.email = '$user_email'";
		$set_exists = true;
	}
	if (isset($user_phone)) {
		// ADD an AND
		if ($set_exists) {
			$set_cond = $set_cond . ", ";
		}
		$set_cond = $set_cond . "U.phone = '$user_phone'";
		$set_exists = true;
	}
	
	// This is the Query to show everything
	$query_input = "UPDATE $sql_item_table SET $set_cond WHERE U.user_id = $user_id;";
	//echo "<p>$query_input</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	
	mysqli_close($sqli);
	return $item;
}

// Main 
function user_run($id) {
	user_print($id);
}

// The user id
$user_id = sql_removeProblemChars($_GET["uid"]);
if (!isset($user_id)) {
	$user_id = sql_removeProblemChars($_POST["uid"]);
}

// The username
$user_name = sql_removeProblemChars($_POST["uname"]);
$user_pw   = sql_removeProblemChars($_POST["upw"]);
$user_login = $_COOKIE["cs_ulog"];

$user_fname =   sql_removeProblemChars($_POST["rname"]);
$user_address = sql_removeProblemChars($_POST["address"]);
$user_phone =   sql_removeProblemChars($_POST["phone"]);
$user_email =   sql_removeProblemChars($_POST["email"]);

$has_id = isset($user_id);
$has_nm = isset($user_name);
$has_pw = isset($user_pw);

// If any of the changable values are set
$has_fname   = isset( $user_fname   );
$has_address = isset( $user_address );
$has_phone   = isset( $user_phone   );
$has_email   = isset( $user_email   );
$change_valid = ($has_id) && ($has_fname || $has_address || $has_phone || $has_email);

// If we have both ID and password
if ($has_nm && $has_pw) {
	// Get the user id
	$user = user_get(null, $user_name);
	$user_id = $user["id"];
	$user_name = $user["username"];
	
	// Login
	$success = user_login($user_id, $user_pw);
	
	echo "{\"id\": $user_id,\"success\": " . (($success) ? '1' : '0') . "}";
	if ($success) {
		// Set the cookie
		$exp = time() + (60*60*24*31);
		setcookie("cs_ulog", "{\"id\":$user_id,\"username\":\"$user_name\",\"password\":\"$user_pw\"}", $exp, '/');
	} 
	
} else if ($has_id && !$change_valid) {
	// Get user info
	user_run($user_id);
} else if ($change_valid) {
	// Update 
	user_change($user_id, $user_fname, $user_address, $user_phone, $user_email);
	echo "{}";
} else {
	echo "{}";
}

?>