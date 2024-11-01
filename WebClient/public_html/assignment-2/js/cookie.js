// Get cookie value
function cookie_get(cookie_name) {
	// The first half of the cookie, content is after the plus 
	let cookieKey = cookie_name + '=';
	
	// Set the cookie to decoded string 
	let cookieDC = document.cookie; //decodeURIComponent(document.cookie);
	
	// Crack the cookie 
	let cookieCracked = cookieDC.split(';');
	
	// For all the cookies 
	for (let i = 0; i < cookieCracked.length; i++) {
		// This is the cookie in question 
		let cookie = decodeURIComponent(cookieCracked[i]);
		
		// if the cookie contains the string 
		let cookieSeperate = cookie.split('=');
		
		// Get the values
		const cookieName = cookieSeperate[0].trim();
		
		// Check if time is good 
		if (cookieName == cookie_name) {
			// Value of the cookie name
			const cookieValue = cookieSeperate.slice(1).join('=');
			
			if (cookieSeperate.length > 1) {
				// Get the value of the cookie
				return cookieValue;
			}
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
	let cookieBody   = cookie_name + '=' + cookie_value;
	let cookieExpire = "expires=" + date.toUTCString();
	let cookiePath   = "path=/";
	let cookieDomain = "domain=eris.ad.murdoch.edu.au";
	
	// Set to the document.cookie, saves. 
	document.cookie = cookieBody + ';' + 
	                  cookiePath + ';' +
					  cookieDomain + ';' + 
					  cookieExpire + ';';
}

// Cookie reset 
function cookie_remove(cookie_name) {
	// Set to enoch 0
	let date = new Date();
	date.setTime(0);
	cookie_set(cookie_name, null, date);
}