// Place the item into a fragment 
function catalog_placeItem(item, eFrag, onclick = null) {
	// We will create a new element 
	let eFrame = $( document.createElement("div") );
	eFrame.addClass("catalog-item");
	eFrame.click(function() {
		if (onclick == null) {
			window.location.href = "item.html";
			//"?id=" + item.id;
		} else {
			onclick("item.html", item["id"]);
		}
	});
	
	let eImage = $( document.createElement("img") );
	eImage.attr("src", "./img/item/" + item["id"] + ".jpeg") 
	eImage.addClass("catalog-item-image");
	
	let eTitle = $( document.createElement("span") );
	eTitle.text(item["name"]);
	eTitle.addClass("catalog-item-text");
	eTitle.addClass("catalog-item-name");
	
	let ePrice = $( document.createElement("span") );
	ePrice.text("$" + item["price"]);
	ePrice.addClass("catalog-item-text");
	ePrice.addClass("catalog-item-price");
	
	let eStock = $( document.createElement("span") );
	eStock.text(item["stock"] + " left!");
	eStock.addClass("catalog-item-text");
	eStock.addClass("catalog-item-stock");
	
	// Append to the element
	eFrame.append(eImage);
	eFrame.append(eTitle);
	eFrame.append(ePrice);
	eFrame.append(eStock);
	eFrag.append(eFrame);
};

// Place the functions into an existing element
function catalog_place(json, onclick = null) {
	// This is the element we're going to add things to.
	let eCat = $("#catalog");
	
	// Clear the catalog entry div
	eCat.empty();
	
	// Create a document fragment to use for later.
	let eFrag = $( document.createDocumentFragment() );
	
	// For every single value in the JSON array
	for (let i = 0; i < json.length; i++) {
		// This is the item we're at 
		let item = json[i];
		
		// Add to the fragment
		catalog_placeItem(item, eFrag, onclick);
	}
	
	// Add to the document 
	eCat.append(eFrag);
};

// Set catergory into the element 
function catalog_placeCatergory(json, onclick) {
	// Get the element name 
	let eCat = $("select#select-catergory");
	
	// If cat doesn't exist, return 
	if (eCat.length < 1) {
		return;
	}
	
	// If cat has children, set a flag so we don't add anymore 
	if (eCat.children().length > 0) {
		return;
	}
	
	// Create a fragment 
	let eFrag = $( document.createDocumentFragment() );
	
	// Add no option 
	let eOpt = $( document.createElement("option") );
	eOpt.text("None");
	eOpt.click(function (e) {
		// Get the value 
		search_fetch(onclick);
	});
	
	eFrag.append(eOpt);
	
	// For all items...
	for (let i = 0; i < json.length; i++) {
		// This is the catergory 
		let item = json[i];
		
		// Create a new option 
		eOpt = $( document.createElement("option") );
		eOpt.text(item);
		eOpt.click(function() {
			// Get the value 
			search_fetch(onclick);
		});
		
		eFrag.append( eOpt );
	}
	
	eCat.append( eFrag );
}

// Fetch the JSON for the catalog.
function catalog_fetch(inputStr = null, onclick = null) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/catalog.php";
	let query = "";
	
	// If we have arguments...
	if (inputStr != null) {
		query = "?" + inputStr;
	}
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			// Parse the JSON
			let json = JSON.parse(xhr.responseText);
			
			// Place the query items
			catalog_place(json["items"], onclick);
			catalog_placeCatergory(json["categories"], onclick)
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
};

// If the search is not valid.
function search_notValid() {
	// Create a warning element. 
	let eWarning = $( document.createElement("p") );
	eWarning.addClass("catalog-bad");
	eWarning.text("ERROR: Invalid search query, please input all required values.");
	
	// Get the element to append as sibling. 
	let eParent = $("form#search-form");// eInput.parent();
	eParent.append( eWarning );
}

// Check if search is valid. 
function search_isValid(eName) {
	// Check if the element has a value / exists. 
	let eInput = $(eName);
	if (eInput == null || eInput.length < 1) {
		return false;
	}
	
	// if it exists, but doesn't have a valid name 
	if (eInput.val() == null || eInput.val().length < 1) {
		return false;
	}
	
	// Maybe more conditions??
	return true;
}

// Search with parameters.
function search_fetch(onclick) {	
	// Delete all errors 
	let eErrors = $(".catalog-bad");
	eErrors.remove();
	
	// This is the element we're checking
	const eInputName = "input:text#search-input";
	const eSelectName = "select#select-catergory";
	
	// Check if valid, if not. Do not execute any code below if 
	if (!search_isValid(eInputName) && !search_isValid(eSelectName)) {
		search_notValid();
		return false;
	}
	
	// The query
	let query = "";
	
	// Check if we have the element which is required.
	let eInput = $(eInputName);
	if (eInput.length > 0 && eInput.val() != "") {
		// The value we're searching with
		query += "q=" + eInput.val();
	}
	
	// Get the select 
	let eSelect = $(eSelectName);
	if (eSelect.length > 0 && eSelect.val() != "None") {
		// If things are in the query, add a plus 
		if (query.length > 0) {
			query += '&';
		}
		query += "cat=" + eSelect.val();
	}
	
	// Perform the catalog getting.
	catalog_fetch(query, onclick);
	
	// Return true
	return true;
}

// Check searching form on load 
function search_onload(onclick) {
	// Get the value of the form
	const formName = "form#search-form";
	let eForm = $(formName);
	
	// Check if form exists.
	if (eForm == null || eForm.length < 1) {
		return false;
	}
	
	// Set important values.
	eForm.submit( function (elem) {
		// Don't go!
		elem.preventDefault();
		
		// Perform search
		search_fetch(onclick);
	});
	
	return true;
}