// Get user cookie 
function user_loginCookie() {
	// Return the cookie 
	return JSON.parse(cookie_get("cs_ulog"));
}

// If user is logged in...
function user_login(onload) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	let query = "";
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			let json = null;
			
			try {
				json = JSON.parse(xhr.responseText);
			} catch (e) {
				json = null;
			}
			
			// Place the query items
			onload(json);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
}

// Log user out 
function user_logout() {
	cookie_remove('cs_ulog');
	$("#header-login").text("Login");
}

// Try login 
function user_attemptLogin(elem, info, onload) {
	// Set this element to not go wherever.
	elem.preventDefault();
	
	// Make json request into a string
	const reqHeader = "uname=" + encodeURIComponent(info["uname"]) + 
	                  "&upw=" + encodeURIComponent(info["upw"]);
	
	// This is the url we're going to
	let url = "user.php";
	
	// AJAX!!
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			//console.log(xhr.responseText);
			let json = JSON.parse(xhr.responseText);
			
			// Place the query items
			onload(json);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	
	// Make sure they know its a form post
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//console.log(reqHeader);
	
	xhr.send(reqHeader);
}

// This will set the element to welcome the user.
function user_setLogin(onclick) {
	// Get the cookie for the username 
	let login = user_loginCookie();
	
	// If no login 
	if (login == null) {
		//console.log("User is not logged in.");
		return;
	}
	
	// The username
	let username = login.id;
	
	// This sets the "login" detail, to the user's name
	let eLogin = $("#header-login");
	eLogin.text(login.username);
	eLogin.click(function() {
		onclick(login);
	});
}

// Update user info 
function user_change(values) {
	// Make json request into a string
	let cookie = user_loginCookie();
	const reqHeader = "uid=" + (cookie["id"]) + "&" + values;
	//console.log(reqHeader);
	
	// This is the url we're going to
	let url = "user.php";
	
	// AJAX!!
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			//console.log(xhr.responseText);
			let json = JSON.parse(xhr.responseText);
			
			
			// Place the query items
			onload(json);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	
	// Make sure they know its a form post
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	//console.log(reqHeader);
	
	xhr.send(reqHeader);
}

// Modify user details that aren't null 
function user_update() {	
	// Names 
	let names = [
		"rname",
		"address",
		"phone", 
		"email" 
	];
	
	let values = "";
	
	// Add to array if valid 
	for (let i = 0; i < names.length; i++) {
		// Get the name of the new element
		let q = $("#user-" + names[i]);
		
		// If the element exists.
		if (q.length == 1) {
			// And the value is not null 
			let value = q.val();
			if (value != null && value.length > 1) {
				// Add the name into the values
				let str = "";
				if (values.length > 0) {
					str += '&';
				}
				
				str = str + names[i] + "=" + encodeURIComponent(value);
				values += str;
			}
		}
	}
	
	// If our query is long enough...
	if (values.length > 0) {
		// Send it to the function to change 
		user_change(values);
	}
}

// Validate the login form 
function user_goodForm() {
	// Get elements 
	let eUser = $("#user-name");
	let ePass = $("#user-pass");
	
	if (eUser == null || ePass == null) {
		return false;
	}
	
	return (eUser.val() != null && ePass.val() != null);
}

// Function if not logged in, create a form to enter data.
function user_createLoginForm() {
	// The form we're attaching to 
	let eForm = $("#user-login");
	
	// Instead of submit to a foreign webpage, just use ajax
	let onload = function(json) {
		// If success 
		let user_id = json["id"];
		let success = json["success"];
		
		let c = cookie_get("cs_ulog");
		$("#header-login").text(c["username"]);
	};
	
	// This is the request header format we're using.
	eForm.submit( function(e) { 
		// Parse POST info
		let info = {
			"uname": $("#user-name").val(), 
			"upw": $("#user-pass").val() 
		};
		
		// Run function
		user_attemptLogin(e, info, onload);
	});
}

// Onload 
function user_setType() {
	// If no login cookies 
	let logc = user_loginCookie();
	
	// If no login exists...
	if (logc == null) {
		// Set the index 
		index_set("login.html", function(json) {
			user_createLoginForm();
		});
		
		// Set the Login 
		$("#header-login").text("Login");
		return;
	} else {
		
		// If login exists and is valid 
		
		
		// Return the function
		index_set("user.html", function() {
			$("#header-login").text(logc["username"]);
			
			// Set the submit to upload 
			let eForm = $("#user-modify");
			eForm.submit(function(e) {
				e.preventDefault();
				user_update();
			});
		});
	}
}