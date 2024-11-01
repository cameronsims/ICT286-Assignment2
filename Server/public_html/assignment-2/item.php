<?php 

// This is from cordova being annoying, need cross access functions to set into headers.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
//header("Referrer-Policy: no-referrer");

// SQL stuff
include_once("sql.php");
include_once("user-head.php");
include_once("item-head.php");

// Get the ID 

// Before we do anything reguarding the HTML.
$item_id = sql_removeProblemChars($_GET["id"]);
$item_action = $_GET["action"];

$cookie_str = $_COOKIE["cs_ulog"];
	
$json_str = null;

// Cordova work around
if (!isset($cookie_str)) {
	$cookie_str = $_POST["cs_ulog"];
	$json_str = $cookie_str;
} else {
	$json_str = ltrim(urldecode($cookie_str), '%');
}

$user_log = json_decode($json_str, true);

$user_login = json_decode($json_str, true);

$is_loggedin = user_login($user_login["id"], $user_login["password"]);
$is_admin = user_isAdmin($user_login["id"]);
$logged_in_as_admin = ($is_loggedin && $is_admin);

// Before we do anything reguarding the HTML.
if ($item_action == "get") {
	item_fetch($item_id);
} 
// If we're logged in correctly.
else if ($logged_in_as_admin) {
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
		} else if ($item_action == "edit" && isset($item_id)) {
			item_change($item_id, $name, $category, $description, $price, $stock);
			item_fetch($item_id);
		}
	}
}


?>