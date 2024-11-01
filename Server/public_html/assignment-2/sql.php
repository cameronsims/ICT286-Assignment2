<?php 

// This is from cordova being annoying, need cross access functions to set into headers.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
//header("Referrer-Policy: no-referrer");

// Get the login
function sql_login() {
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

// Standardise and remove issues with the values.
function sql_removeProblemChars($str) {
	// Replace all values with cool regex!
	$good_chars = [ "\\[", "\\]", "\\-", "\\(", "\\)", "\\ ", "\\@", "\\.", "\\," ];
	
	// If string is low 
	if ($str == null || sizeof($str) == 0) {
		return null;
	}
	
	// Create the regex
	$regex_str = "/[^(A-Za-z0-9";
	
	// Add all good characters.
	for ($i = 0; $i < sizeof($good_chars); $i++) {
		$regex_str = $regex_str . $good_chars[$i];
	}
	
	// Finish the regex
	$regex_str = $regex_str . ")]/s";
	
	// These will remove any non-alphabetical/numerical characters.
	return preg_replace($regex_str, '', $str);
}

?>