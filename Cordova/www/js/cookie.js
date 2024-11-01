// Get cookie value
function cookie_get(cookie_name) {
	const val = window.localStorage.getItem(cookie_name);
	
	if (val == undefined) {
		return null;
	}
	
	return val;
}

// Set the cookie 
function cookie_set(cookie_name, cookie_value, cookie_date = new Date()) {
	if (cookie_value == null || cookie_value == undefined) {
		cookie_remove(cookie_name);
	}
	
	window.localStorage.setItem(cookie_name, cookie_value);
}

// Cookie reset 
function cookie_remove(cookie_name) {
	// Set to enoch 0
	window.localStorage.removeItem(cookie_name);
}