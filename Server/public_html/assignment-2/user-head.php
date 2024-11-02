<?php

// This is from cordova being annoying, need cross access functions to set into headers.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
//header("Referrer-Policy: no-referrer");

// Check if the user id and pw are correct, true if so, false if not 
function user_exists($user_id, $user_pw) {
	// Get the user, if null they don't 
	$user = user_get($user_id);
	
	// if their password matches 
	if ($user == null || $user_pw == null) {
		return false;
	}
	
	//echo md5($user_pw) . ", " . $user["password"];
	
	return (md5($user_pw) == $user["password"]);
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
		return null;
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
		$item["id"]       = $record["user_id"];
		$item["password"] = $record["password"];
		$item["username"] = $record["username"];
		$item["type"]     = $record["user_type"];
		$item["name"]     = $record["name"];
		$item["address"]  = $record["address"];
		$item["phone"]    = $record["phone"];
		$item["email"]    = $record["email"];
	}
	
	
	mysqli_close($sqli);
	return $item;
}

// Create the user from DB 
function user_create($user_name, $user_pw) {
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
		return null;
	}
	
	// These are important names for the database.
	$sql_item_table = "$sql_user.users";
	
	// This is the Query to show everything
	$query_input = "INSERT INTO $sql_item_table (username, password, user_type) VALUES ('$user_name', md5('$user_pw'), 'customer');";
	//echo $query_input;
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	mysqli_close($sqli);
}

// Delete the user from DB 
function user_delete($user_id) {
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
		return null;
	}
	
	// These are important names for the database.
	$sql_item_table = "$sql_user.users U";
	
	// Prepare the Query
	$where_condition = "WHERE U.user_id = $user_id";
	
	// This is the Query to show everything
	$query_input = "DELETE FROM $sql_item_table $where_condition;";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	mysqli_close($sqli);
}

// Print all users
function user_printAll() {
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
		return null;
	}
	
	// These are important names for the database.
	$sql_item_table = "$sql_user.users U";
	
	// This is the Query to show everything
	$query_input = "SELECT * FROM $sql_item_table;";
	//echo "<p>" . $query_input . "</p>";
	
	// Input the query
	$query_result = mysqli_query($sqli, $query_input);
	$query_resultn = mysqli_num_rows($query_result);
	
	$item = null;
	echo "[";
	$i = 0;
	while ($record = mysqli_fetch_assoc($query_result)) {
		$item_id = $record["user_id"];
		echo "{\"id\":$item_id,";
		
		$item_uname = $record["username"];
		echo "\"username\":\"$item_uname\",";
		
		$item_type = $record["user_type"];
		echo "\"type\":\"$item_type\",";
		
		$item_name = $record["name"];
		echo "\"name\":\"$item_name\",";
		
		$item_address = $record["address"];
		echo "\"address\":\"$item_address\",";
		
		$item_phone = $record["phone"];
		echo "\"phone\": \"$item_phone\",";
		
		$item_email = $record["email"];
		echo "\"email\": \"$item_email\"}";
		
		// If not last
		if ($i + 1 != $query_resultn) {
			echo ",";
		}
		
		$i++;
	}
	echo "]";
	
	
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

// Set values 
function user_setParam($param) {
	if (isset($param)) {
		return "'$param'";
	}
	return "null";
}

// Change user data 
function user_change($user_id, $user_pw, $user_type, $user_fname, $user_address, $user_phone, $user_email) {
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
	
	// If any of these are null we will set them to the string null
	$user_fname   = user_setParam($user_fname  );
	$user_address = user_setParam($user_address);
	$user_type    = user_setParam($user_type   );
	$user_email   = user_setParam($user_email  );
	$user_phone   = user_setParam($user_phone  );
	
	
	$set_cond = "U.name = $user_fname,";
	
	// If the user wants to change the password, make sure it is not null
	if (isset($user_pw) && strlen($user_pw) > 1) {
		$set_cond = $set_cond . "U.password = md5('$user_pw'),";
	}
	
	$set_cond = $set_cond . "U.address = $user_address,";
	
	if (isset($user_type) && $user_type != "null" && $user_type != null) {
		$set_cond = $set_cond . "U.user_type = $user_type,";
	}
		
	$set_cond = $set_cond . "U.email = $user_email,";
	$set_cond = $set_cond . "U.phone = $user_phone";
	
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

// If admin 
function user_isAdmin($id) {
	// Get user 
	$user = user_get($id);
	
	// If staff 
	return $user["type"] == "staff";
} 






// Run the script 
function user_exec() {
	// What we want to perform
	$action = $_GET["action"];
	// If action not defined, check post 
	if (!isset($action)) {
		$action = $_POST["action"];
	}
	
	// The user id
	$user_id = sql_removeProblemChars($_GET["uid"]);
	if (!isset($user_id)) {
		$user_id = sql_removeProblemChars($_POST["uid"]);
	}
	
	// The username
	$user_name = sql_removeProblemChars($_POST["uname"]);
	$user_pw   = sql_removeProblemChars($_POST["upw"]);
	
	$has_id = isset($user_id);
	$has_nm = isset($user_name);
	$has_pw = isset($user_pw);
	
	// If we want to get an account 
	if ($action == "get" && $has_id) {
		// Get user info
		user_run($user_id);
		return;
	}
	
	// Other vars
	$user_type  =   sql_removeProblemChars($_POST["type"   ]);
	$user_fname =   sql_removeProblemChars($_POST["rname"  ]);
	$user_address = sql_removeProblemChars($_POST["address"]);
	$user_phone =   sql_removeProblemChars($_POST["phone"  ]);
	$user_email =   sql_removeProblemChars($_POST["email"  ]);
	
	// If any of the changable values are set
	$has_type    = isset( $user_type    );
	$has_fname   = isset( $user_fname   );
	$has_address = isset( $user_address );
	$has_phone   = isset( $user_phone   );
	$has_email   = isset( $user_email   );
	
	// Try login as user, if fails login as admin
	// If none work, then the user is not authorised to change
	$cookie_str = $_COOKIE["cs_ulog"];
	$json_str = null;
	
	// Cordova work around
	if (!isset($cookie_str)) {
		$cookie_str = $_POST["cs_ulog"];
		$json_str = $cookie_str;
	} else {
		$json_str = ltrim(urldecode($cookie_str), '%');
	}
	
	$user_login = json_decode($json_str, true);
	$user = $user = user_get($user_login["id"]);
	$valid_login = user_exists($user_login["id"], $user_login["password"]);
	$admin_access = false;
	
	// If the login was valid, check if the ids are the same OR if the user is an admin
	if ($user["type"] == "staff") {
		$valid_login = true;
		$admin_access = true;
	}
	
	//echo ltrim(urldecode($_COOKIE["cs_ulog"]), '%'));
	//echo "[" . $user_login["id"] . ", " . $user_login["password"]. "]";
	
	// Print all values
	if (isset($_GET["getall"]) && $admin_access) {
		// Check if login is admin
		//echo var_dump($user);
		
		// If it is, print out all users
		if ($user["type"] == "staff") { 
			user_printAll();
		}
	} else {
	
		// If we have a good change 
		$change_valid = ($has_id && $valid_login);
		//echo "$action, $change_valid = ($has_id && $valid_login)";
		
		// If the user is referring to themselves
		$changeThemself = ($user_id == $user["id"] && $valid_login);
		$canChange = $changeThemself || $admin_access;
		
		//echo "$action && $valid_login && $canChange";
	
		// If want to login
		if ($action == "login" && $has_nm && $has_pw) {
			// We need both name and password
			
			// Get the user id
			$user = user_get(null, $user_name);
			$user_id = $user["id"];
			$user_name = $user["username"];
			
			// Login
			$success = user_login($user_id, $user_pw);
			
			if ($user_id == null) {
				$user_id = "null";
			}
			
			echo "{\"id\":$user_id, \"success\":" . (($success) ? '1' : '0');
			if ($success) {
				// Set the cookie
				$is_staff = ($user["type"] == "staff") ? '1' : '0';
				$exp = time() + (60*60*24*31);
				
				// Stupid annoying cordova fix, LOVE CORDOVA COOKIES!!!!!!!
				$cookie_val = urlencode("{\"id\":$user_id,\"username\":\"$user_name\",\"password\":\"$user_pw\",\"admin\":$is_staff}");
				echo ", \"cs_ulog\":  \"$cookie_val\"";
				
				$new_cookie = $cookie_val;
				
				setcookie("cs_ulog", '%' . $new_cookie, $exp, '/', 'eris.ad.murdoch.edu.au');
			}
			
			echo "}";
		}
		// If we want to create an account
		else if ($action == "create" && $has_nm && $has_pw) {
			
			// IF user of same name exists...
			$user = user_get(null, $user_name);
			if ($user != null) {
				echo "{\"success\":0}";
				return;
			}
			
			// Create an account
			user_create($user_name, $user_pw);
			
			$user = user_get(null, $user_name);
			if ($user == null) {
				echo "{\"success\":0}";
			} else {
				echo "{\"success\":1}";
				//user_run($user_id);
			}
		}
		// If we want to edit and existing account
		else if ($action == "edit" && $change_valid && $canChange) {
			// If not admin, set naughty values to null 
			if (!$admin_access) {
				$user_type = null;
			}
			
			// Update 
			user_change($user_id, $user_pw, $user_type, $user_fname, $user_address, $user_phone, $user_email);
			user_run($user_id);
		}
		// If we want to delete an existing account
		else if ($action == "delete" && $valid_login && $canChange) {
			// Delete
			$user = user_get($user_id);
			if ($user == null) {
				echo "{\"success\":0}";
			}
			user_delete($user_id);
			
			// Delete
			$new_user = user_get($user_id);
			if ($new_user != null) {
				echo "{\"success\":0}";
			}
			echo "{\"success\":1}";
		} else {
			echo "{\"success\":0}";
		}
		
		
		
	}
}

?>