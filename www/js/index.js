// Set the current window to another file 
const index_set = function(file_name, after_load = function() {}) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/" + file_name;
	let query = "";
	
	// Set names
	document.title = "Rael Trading"
	if (file_name != "index.html") {
		// Get the name of the file 
		let tokens = file_name.split('.');
		
		// Remove file extension
		if (tokens.length > 1) {
			tokens.pop();
		}
		
		// Join to make new name
		let fname = tokens.join(' ');
		
		// Set first char to upper case.
		fname = fname[0].toUpperCase() + fname.substring(1);
		
		document.title = "Rael Trading - " + fname;
	}
	
	window.location.hash = file_name;
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the text into the content element
			let txt = xhr.responseText;
			$("#content").html(txt);
			
			// If another function was demanded
			after_load();
		}
	};
	
	//if (file_name != "user.html") {
	//	user_setLogin(function(user) {
	//		index_set("user.html", user_setType);
	//	});
	//}
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
};

// Used to fetch items in the catalog 
const index_catalog_fetch = function(inputStr = null) {
	// This changes the location of the content div. 
	let onclick = function(location, id) {
		// Set the index page 
		index_set(location);
		
		// Load the item 
		item_load(id);
	}; 
	catalog_fetch(inputStr, onclick);
	search_onload(onclick);
};