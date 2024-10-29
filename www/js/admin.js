// Fetch the JSON for the catalog.
function user_fetch(onload = null) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	let query = "?getall=1";
	
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
				let json = JSON.parse(xhr.responseText);
			//	console.log(xhr.responseText);
				
				// Place the query items
				onload(json);
			} catch (e) {}
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
};

// Fetch the JSON for the catalog.
function item_fetch(onload = null) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/catalog.php";
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url;// + query;
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
			} catch (e) {}
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
};




// Set one change 
function admin_changeOne(tuple, onload = function() {}) {
	// Demand the admin panel change it
	
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/user.php";
	let query = "action=edit";//?action=edit";
	
	// These are the columns 
	let cols = Object.keys( tuple );
	let reqNames = { 
		"id": "uid", 
		"username": "uname", 
		"type": "type",
		"name": "rname",
        "address": "address",
		"phone": "phone",
		"email": "email" 
	};
	
	// Add query arguments 
	for (let i = 0; i < cols.length; i++) {
		// This is the column & value pair 
		const col = cols[i];
		
		const left = reqNames[col];
		const right = tuple[col]
		
		const key = encodeURIComponent(left);
		const val = encodeURIComponent(right);
		
		// If val isn't null 
		if (val != null && val.length > 0) {
			// If first query, don't add a &
			let c = '&';
			if (query.length < 1) {
				c = '';
			}
			
			query += (c + key + '=' + val);
		}
	}
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url;// + query;
	xhr.open("POST", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// We've sent it successfully.
			//console.log(xhr.responseText);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	
	xhr.send(query);
}




// Ask Website to change for all users.
function admin_setUserChanges() {
	// For all rows in the users.	
	let eList = $("table#user-list tbody");
	let eItems = eList.children();
	
	// For each column...
	const cols = ["id", "username", "type", "name", "address", "phone", "email"];	
	
	// For all items
	for (let i = 0; i < eItems.length; i++) {
		// This row 
		let tuple = eItems[i];
		
		let e = $(tuple);
		let items = e.children();
		
		// From here, what we want to do is get the data, and place it into this object 
		let obj = {
			"id": null,
			"username": null,
			"type": null,
			"name": null,
			"address": null,
			"phone": null,
			"email": null
		};
		
		// For each column
		for (let j = 0; j < items.length; j++) {
			// Add it to one of the values 
			const col = cols[j];
			const data = $(items[j]);
			
			// If we have no children, get the text value 
			let value = null;
			
			if (data.children().length == 0) {
				value = data.text();
			} else {
				// Get the first child and set that 
				value = $(data.children()[0]).val();
			}
			
			obj[col] = value;
		}
		
		// Update 
		admin_changeOne(obj);
	}
}

// Ask Website to change all items 
function admin_setItemChanges() {
	
	let eTable = $("table#item-list tbody");
	let eRows = eTable.children();
	
	// Get table, update all rows 
	for (let i = 0; i < eRows.length; i++) {
		let eRow = $( eRows[i] );
		let eCols = eRow.children();
		
		// Get important columns 
		let keys = [ "id", "name", "category", "description", "price", "stock" ];
		let obj = {};
		
		obj[keys[0]] = $(eCols[0]).text();
		
		// For all columns
		for (let j = 1; j < keys.length; j++) {
			let col = $(eCols[j]).children()[0];
			obj[ keys[j] ] = $(col).val();
		}
		
		// Change the values.
		admin_itemEdit(obj["id"], obj["name"], obj["category"], obj["description"], obj["price"], obj["stock"]);
	}
	
	//admin_itemEdit();
}


// Call the update file 
function admin_itemRun(action, q, onload) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/item.php";
	let query = "?action=" + action + "&" + q;
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			try {
				let json = JSON.parse(xhr.responseText);
			
				// Place the query items
				onload(json);
			} catch (e) {}
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
}

// Create a new item
function admin_itemCreate(name, category, price, stock, onload) {
	// Get id etc 
	let query = "name=" + name + 
				"&category=" + category + 
				"&price=" + price + 
				"&stock=" + stock; 
	
	admin_itemRun("create", query, onload);
}

// Edit the item 
function admin_itemEdit(id, name, category, description, price, stock) {
	// Function usd
	let onload = function(json) {
		
	};
	
	// Get id etc 
	let query = "id=" + id +
	            "&name=" + name + 
				"&category=" + category + 
				"&description=" + description + 
				"&price=" + price + 
				"&stock=" + stock; 
	
	admin_itemRun("edit", query, onload);
}

// Delete an item
function admin_itemDelete(id) {
	// Function usd
	let onload = function(json) {
		
	};
	
	// Get id etc 
	let query = "id=" + id; 
	
	admin_itemRun("delete", query, onload);
}

// Create a user 
function admin_userCreate(uname, upass, onload) {
	// Create the user
	// Make json request into a string
	const reqHeader = "uname=" + encodeURIComponent(uname) + 
	                  "&upw="  + encodeURIComponent(upass);
	
	// This is the url we're going to
	let url = "user.php" + "?action=create";
	
	// AJAX!!
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			try {
				// Parse the JSON
				//console.log(xhr.responseText);
				//let json = JSON.parse(xhr.responseText);
				
				// Place the query items
				onload(null);
			} catch (e) {}
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

// Delete a user 
function admin_userDelete(id) {
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

// Add controls 
function admin_addUserControls(eUserTable, onclick) {
	// Create a new fragment
	let eFrag = $( document.createDocumentFragment() );
	
	// If any of the elements work
	if ($("#user-list-name").length == 0 &&
		$("#user-list-pass").length == 0 &&
	    $("#user-list-new").length == 0 &&
		$("#user-list-commit").length == 0)
	{
	
		// Create a input 
		let eNameInput = $( document.createElement("input") );
		eNameInput.attr("id", "user-list-name");
		eNameInput.attr("placeholder", "Username");
		eNameInput.attr("type", "text");
		eFrag.append(eNameInput);
		
		let ePassInput = $( document.createElement("input") );
		ePassInput.attr("id", "user-list-pass");
		ePassInput.attr("placeholder", "Password");
		ePassInput.attr("type", "password");
		eFrag.append(ePassInput);
		
		//let f = function(e) {
		//	// Prevent relaoding 
		//	e.preventDefault();
		//	
		//	// Get the information in the name
		//	let name = eNameInput.val();
		//	let pass = ePassInput.val();
		//	
		//	if (name != null && pass != null) {
		//		// Create user, then refresh the table
		//		admin_userCreate(name, pass);
		//		admin_addUsers();
		//	}
		//};
		
		// Create new button
		let eNew = $( document.createElement("button") );
		eNew.attr("id", "user-list-new");
		eNew.text("Create New");
		eNew.attr("type", "button");
		eNew.click(function(e) {
			e.preventDefault();
			onclick();
		});
		eFrag.append(eNew);
		
		// Commit changes button
		let eCommit = $( document.createElement("button") );
		eCommit.attr("id", "user-list-commit");
		eCommit.text("Commit Changes");
		eCommit.attr("type", "button");
		eCommit.click(admin_setUserChanges);
		eFrag.append(eCommit);
		
		
		// Add to the document
		eUserTable.after(eFrag);
	}
}

// Load all users
function admin_addUsers() {
	// Get values 
	const cols = ["id", "username", "type", "name", "address", "phone", "email"];
	
	// We will read all items and users from the database...
	let eUserTable = $("#user-list");
	let eUserTableBody = $("#user-list tbody");
	
	if (eUserTableBody.length < 1) {
		eUserTableBody = $( document.createElement("tbody") );
		eUserTable.append(eUserTableBody);
	} else {
		eUserTableBody.empty();
	}
	
	// Add as much rows into the list as possible
	let onload = function(json) {
		// For each column...
		
		// Get input
		
		// For each row 
		for (let i = 0; i < json.length; i++) {
			// Add a new row 
			let eRow = $( document.createElement("tr") );
			eRow.addClass("table-user-row");
			let tuple = json[i];
			
			// Add each column in
			for (let j = 0; j < cols.length; j++) {
				// Add col in 
				let eCol = $( document.createElement("td") );
				const col = cols[j];
				eCol.addClass("table-user-data");
				eCol.addClass("table-user-" + col);
				
				if (col == "id" || j == "name") {
					eCol.text( tuple[ col ] );
				} else {
					// Create input 
					let eInput = null; 
					
					if (col == "type") {
						// If type, make a drop down menu
						eInput = $( document.createElement("select") );
						
						let eStaff = $(document.createElement("option"));
						eStaff.val("staff");
						eStaff.text("staff");
						eInput.append(eStaff);
						
						let eCustomer = $(document.createElement("option"));
						eCustomer.val("customer");
						eCustomer.text("customer");
						eInput.append(eCustomer);
					} else {
						// Add a value to change whatever.
						eInput = $( document.createElement("input") );
						eInput.attr("placeholder", col);
					}
					
					// Set value 
					eInput.val(tuple[col]);
					eCol.append(eInput);
				}
				
				eRow.append(eCol);
			}
			
			// Create a delete col 
			let eColDelete = $( document.createElement("td") );
			let eDelete = $( document.createElement("button") );
			eDelete.addClass("btn-delete");
			eDelete.text("Delete");
			eDelete.click( function() {
				// Get the data 
				let eColumns = eRow.children();
				
				// Ask if the user actually wants to delete 
				let answer = confirm("Are you sure you want to delete this user? This action cannot be undone.");
				if (!answer) {
					return;
				}
				
				// Get ID of user 
				let id = $(eColumns[0]).text();
				admin_userDelete(id);
				
				// Delete the row
				eRow.remove();
			});
			
			eColDelete.append(eDelete);
			eRow.append(eColDelete);
			
			eUserTableBody.append(eRow);
		}
		
	}
	
	// Add the controls
	let onclick = function () {
		// Add the new account, then run the function
		// Get the information in the name
		let name = $("#user-list-name").val();
		let pass = $("#user-list-pass").val();
		admin_userCreate(name, pass, function(json) {
			admin_addUsers();
		});
	};
	
	// Add the contrls (won't run if they exist)
	admin_addUserControls(eUserTable, onclick);
	
	// Fetch the users 
	user_fetch(onload);
}



// Add controls 
function admin_addProductControls(eItemTable, onclick) {
	// Check if the values are good
	if ($("#table-item-name").length > 0 &&
	    $("#table-item-type").length > 0 &&
	    $("#table-item-price").length > 0 &&
	    $("#table-item-stock").length > 0) 
	{
		return
	}
	
	// Create a fragment 
	let eFrag = $( document.createDocumentFragment() );
	
	let eName     = $( document.createElement("input") );
	eName.attr("id", "table-item-name");
	eName.attr("placeholder", "Name");
	eName.attr("type", "text");
	eFrag.append(eName);
	
	// Get the items 
	let eCategory = $( document.createElement("select") );
	eCategory.attr("id", "table-item-type");
	
	// Get items 
	item_fetch(function(json) {
		let cats = json["categories"];
		for (let i = 0; i < cats.length; i++) {
			// New option 
			let eOpt = $( document.createElement("option") );
			eOpt.text( cats[i] );
			eOpt.val ( cats[i] );
			eCategory.append(eOpt);
		}
	});
	
	eFrag.append(eCategory);
	
	let ePrice = $( document.createElement("input") );
	ePrice.attr("id", "table-item-price"); 	
	ePrice.attr("placeholder", "Price");
	ePrice.attr("type", "text");
	eFrag.append(ePrice);
	
	let eStock = $( document.createElement("input") );
	eStock.attr("id", "table-item-stock");
	eStock.attr("placeholder", "Stock");
	eStock.attr("type", "text");
	eFrag.append(eStock);
	
	let eSubmit = $( document.createElement("button") );
	eSubmit.text("Submit New Item");
	eSubmit.click(function(e) {
		// Prevent redirection 
		e.preventDefault();
		
		// If all aren't null
		if (eName.val() != null &&
		    eCategory.val() != null &&
		    ePrice.val() != null &&
			eStock.val() != null) 
		{
			onclick();
		}
	});
	eFrag.append(eSubmit);
	
	// Commit changes button
	let eCommit = $( document.createElement("button") );
	eCommit.text("Commit Changes");
	eCommit.click(admin_setItemChanges);
	eFrag.append(eCommit);
	
	eItemTable.after(eFrag);
}

// Load all products 
function admin_addProducts() {
	// We will read all items and users from the database...
	let eItemTable = $("#item-list");
	let eItemTableBody = $("#item-list tbody");
	if (eItemTableBody.length == 0) {
		eItemTableBody = $( document.createElement("tbody"));
		eItemTable.append(eItemTableBody);
	} else {
		eItemTableBody.empty();
	}
	
	// Add as much rows into the list as possible
	let onload = function(json) {
		// Create the catergories
		const options = json["categories"];
		
		// For each column...
		const cols = ["id", "name", "category", "desc", "price", "stock"];
		const type = [null, "text", null, "text", "number", "number"];
		
		// Load all values 
		const items = json["items"];
		for (let i = 0; i < items.length; i++) {
			// Get the rows
			const row = items[i];
			
			// Add row 
			let eRow = $( document.createElement("tr") );
			eRow.addClass("table-item-row");
			
			// Add data 
			for (let j = 0; j < cols.length; j++) {
				// The column
				const col = cols[j];
				
				// The data 
				let eData = $( document.createElement("td") );
				eData.addClass("table-item-" + col);
				eData.addClass("table-item-data");
				
				// If it is not the ID, make an input value 
				if (col == "id") {
					eData.text( row[col] );
				} else if (col == "category") {
					// Add the category options 
					let eSelect = $( document.createElement("select") );
					
					// Add the elem 
					for (let k = 0; k < options.length; k++) {
						// Append the element 
						let newElem = $( document.createElement("option") );
						newElem.val (options[k]);
						newElem.text(options[k]);
						
						eSelect.append(newElem);
					}
					
					eSelect.val( row[col] );
					eData.append(eSelect);
					
				} else {
					let eInput = $(document.createElement("input"));
					
					// Set default
					eInput.val(row[col]);
					eInput.attr("type", type[j]);
					eData.append(eInput);
				}
				
				eRow.append(eData);
			}
			
			// Add a button delete 
			let eDataNew = $( document.createElement("td") );
			let eDelete = $( document.createElement("button") );
			eDelete.addClass("btn-delete");
			eDelete.text("Delete");
			eDelete.click( function() {
				// Get the data 
				let eColumns = eRow.children();
				
				// Ask if the user actually wants to delete 
				let answer = confirm("Are you sure you want to delete this item? This action cannot be undone.");
				if (!answer) {
					return;
				}
				
				// Get ID of user 
				let id = $(eColumns[0]).text();
				admin_itemDelete(id);
				
				// Delete the row
				eRow.remove();
			});
			
			// Append the value
			eDataNew.append(eDelete);
			eRow.append(eDataNew);
			
			// Add a new row to the bottom
			eItemTableBody.append(eRow);
		}
	};
		
	// Add controls, won't if exist
	admin_addProductControls(eItemTable , function() {
		let name     = $("#table-item-name") .val();
		let category = $("#table-item-type") .val();
		let price    = $("#table-item-price").val();
		let stock    = $("#table-item-stock").val();
		admin_itemCreate(name, category, price, stock, function(json) {
			admin_addProducts();
		});
	});	

	// Fetch the users 
	item_fetch(onload);
}


// On load 
function admin_onload() {
	admin_addUsers();
	admin_addProducts();
}