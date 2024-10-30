// Get user cookie 
function user_loginCookie() {
	// Get the non-uri compnent 
	let cookieStr = cookie_get("cs_ulog");
	if (cookieStr == null) {
		return null;
	}
	
	// If we have to %% at one and two
	if (cookieStr[0] == '%' && cookieStr[1] == '%') {
		cookieStr = cookieStr.substring(1);
	}
	
	let jsonStr = decodeURIComponent(cookieStr);
	
	// Return the cookie 
	return JSON.parse(jsonStr);
}

// If user is logged in...
function user_login(onload) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	let query = "?action=login";
	
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
	cookie_remove("cs_ulog");
	$("#header-login").text("Login");
	
	// Set to login
	index_set('login.html');
}

// Delete user 
function user_delete() {
	// Warn user 
	let wantsToDelete = confirm("Are you sure you want to delete this account? This cannot be undone.");
	if (!wantsToDelete) {
		return;
	}
	
	// Delete.
	const id = user_loginCookie()["id"];
	
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	let query = "?action=delete&uid=" + id;
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// We've sent it successfully.
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	xhr.send(null);
}

// Try login 
function user_attemptLogin(elem, info, onload) {
	// Set this element to not go wherever.
	elem.preventDefault();
	
	// Make json request into a string
	const reqHeader = "uname=" + encodeURIComponent(info["uname"]) + 
	                  "&upw="  + encodeURIComponent(info["upw"]);
	
	// This is the url we're going to
	let url = "user.php" + "?action=login";
	
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

// Create an account 
function user_createAccount(elem, info, onload) {
	// Set this element to not go wherever.
	elem.preventDefault();
	
	// Make json request into a string
	const reqHeader = "action=create"+
	                  "&uname=" + encodeURIComponent(info["uname"]) + 
	                  "&upw="  + encodeURIComponent(info["upw"]);
	
	// This is the url we're going to
	let url = "user.php" + "?action=create";
	
	// AJAX!!
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			try {
				let json = JSON.parse(xhr.responseText);
			
				// Place the query items
				onload(json);
			} catch (e) {
				
			}
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
	let url = "user.php" + "?action=edit";
	
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
			
			//// Place the query items
			onload(json);
			
			// Tell user about success 
			let eSuccess = $( document.createElement("p") );
			eSuccess.text("Account change success!");
		
			$("#user-modify").after(eSuccess);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	
	// Make sure they know its a form post
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	xhr.send(reqHeader);
}

// Modify user details that aren't null 
function user_update() {	
	// Names 
	let names = [
		"password",
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
				if (names[i] != "password") {
					str = str + '&' + names[i] + "=" + encodeURIComponent(value);
				} else {
					str = str + "upw=" + encodeURIComponent(value);
				}
				
				
				values += str;
			}
		}
	}
	
	// If our query is long enough...
	if (values.length > 0) {
		// Send it to the function to change 
		//console.log(values);
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

// Fetch user details 
function user_getUserDetails(onload) {
	// If we do not have any arguments, we will assume they want the entire DB
	const login = user_loginCookie();
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	const query = "?action=get&uid=" + login["id"];
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			try {
				// Parse the JSON
				//console.log(xhr.responseText);
				let json = JSON.parse(xhr.responseText);
				
				// Place the query items
				onload(json);
			} catch (e) {
				
			}
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
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
		if (!success) {
			// Tell user 
			alert("Account could not log in.");
			return;
		}
		
		let c = user_loginCookie();
		$("#header-login").text(c["username"]);
		
		// Wait and then go 
		index_set("home.html"); 
	};
	
	// This is the request header format we're using.
	eForm.submit( function(e) { 
		// If either are null
		let uname = $("#user-name").val();
		let upass = $("#user-pass").val();
		
		if (uname == null || upass == null) {
			// Don't redirect
			e.preventDefault();
			
			// Tell user 
			alert("Please ensure you have both a username and a password!");
			return;
		}
		
		// Parse POST info
		let info = {
			"uname": uname,
			"upw": upass
		};
		
		// Run function
		user_attemptLogin(e, info, onload);
	});
}

// Function to create a form to create new account
function user_createSignupForm() {
	// The form we're attaching 
	let eForm = $("#user-signup");
	
	// When we submit 
	eForm.submit( function(e) {
		// If either are null
		let uname = $("#user-new-name").val();
		let upass = $("#user-new-pass").val();
		
		// Don't redirect
		e.preventDefault();
		
		if (uname == null || upass == null) {
			// Tell user 
			alert("Please ensure you have both a username and a password!");
			return;
		}
		
		// On load 
		let onload = function(json) {
			// If not successful 
			if (json["success"] != 1) {
				alert("We couldn't create an account, please try a different method.");
			} else {
				alert("Account created, please login now!");
			}
		}
	
	
		// Parse POST info 
		let info = {
			"uname": uname,
			"upw": upass
		};
		
		// Try create account
		user_createAccount(e, info, onload);
	});
}

// Onload 
function user_setType() {
	// If no login cookies 
	let logc = user_loginCookie();
	console.log("RGORKGOKGROG");
	
	// If no login exists...
	if (logc == null) {
		// Set the index 
		index_set("login.html", function(json) {
			// Set the Login 
			$("#header-login").text("Login");
			user_createLoginForm();
			user_createSignupForm();
		});
	} else {
		
		// If login exists and is valid 
		// Return the function
		index_set("user.html", function() {
			let header = $("#user-name").text(logc["username"]);
			$("#header-login").text(logc["username"]);
			
			// Set the submit to upload 
			let eForm = $("#user-modify");
			eForm.submit(function(e) {
				e.preventDefault();
				user_update();
			});
			
			// if the user is an admin
			if (logc["admin"] == 1) {
				// Create a cool pathway
				let eAdminBtn = $( document.createElement("button") );
				eAdminBtn.text("Moderate Users");
				
				eAdminBtn.click(function() {
					index_set("admin.html", admin_onload);
				});
				
				$("div.other-panel").append(eAdminBtn);
			}
			
			// Get the SQL data 
			user_getUserDetails(function(user) {
				$("#user-rname")  .val(user["name"]);
				$("#user-address").val(user["address"]);
				$("#user-phone")  .val(user["phone"]);
				$("#user-email")  .val(user["email"]);
			});
		});
	}
}