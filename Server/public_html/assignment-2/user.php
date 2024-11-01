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

user_exec();

?>