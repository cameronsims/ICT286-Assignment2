// Get cookie value
function cookie_get(cookie_name) {
	// The first half of the cookie, content is after the plus 
	let cookieKey = cookie_name + '=';
	
	// Set the cookie to decoded string 
	let cookieDC = decodeURIComponent(document.cookie);
	
	// Crack the cookie 
	let cookieCracked = cookieDC.split(';');
	
	// For all the cookies 
	for (let i = 0; i < cookieCracked.length; i++) {
		// This is the cookie in question 
		let cookie = cookieCracked[i];
		
		// if the cookie contains the string 
		let cookieKeyIndex = cookie.indexOf(cookieKey);
		if (cookieKeyIndex != -1) {
			// Get the value of the cookie
			let cookieValue = cookie.substring(cookieKey.length + 1, cookie.length);
			return cookieValue;
		}
	}
	
	// If no value was found 
	return null;
}

// Set the cookie 
function cookie_set(cookie_name, cookie_value, cookie_date = new Date()) {
	// Get the date (now)
	let date = cookie_date;
	
	// Set the date to be essentially forever.
	date.setTime(date.getTime() + 1000*60*60*24*999);
	
	// Set the expirey, path and value of cookie
	let cookieBody = cookie_name + '=' + cookie_value;
	let cookieExpire = "expires=" + date.toUTCString();
	let cookiePath = "path=/";
	
	// Set to the document.cookie, saves. 
	document.cookie = cookieBody + ';' + cookieExpire + ';' + cookiePath;
}

// Cookie reset 
function cookie_remove(cookie_name) {
	// Set to enoch 0
	let date = new Date();
	date.setTime(0);
	cookie_set(cookie_name, null, date);
}