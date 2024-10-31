// Get list of all item IDs
function item_getCart() {
	// The cookie cart cookie name 
	const shoppingCartName = "cs_shoppingcart";
	
	// The cookie value 
	let cookieCart = cookie_get(shoppingCartName);
	// Check if cookies have any values
	if (cookieCart == null || cookieCart == "null") {
		// Create the cookie and set it
		return null;
	}
	
	// Decode json 
	// Assume we have values, we first decode the cookie value 
	let shoppingCart = JSON.parse(cookieCart);
	if (shoppingCart == null) {
		return null;
	}
	
	// Check if any value is not valid 
	for (let i = 0; i < shoppingCart.length; i++) {
		// item inquestion 
		let item = shoppingCart[i];
		
		// If not valid 
		if (item["amount"] < 1) {
			// Remove this element from the array
			shoppingCart.slice(i + 1);
			
			// Decrement 
			i -= 1;
		}
	}
	
	return shoppingCart;
}

// If item exists in cart 
function item_existsInCart(id) {
	// Assume we have values, we first decode the cookie value 
	let shoppingCart = item_getCart();
	
	// Check if the value exists in the shopping cart
	for (let i = 0; i < shoppingCart.length; i++) {
		// Item in question 
		let item = shoppingCart[i];
		
		// If it does...
		if (item["id"] == id) {
			// Increment it and set flag to true
			return true;
		}
	}
	
	return false;
}

// Add item to the cart (cookies)
function item_addToCart(id) {
	// The cookie cart cookie name 
	const shoppingCartName = "cs_shoppingcart";
	
	// Assume we have values, we first decode the cookie value 
	let shoppingCart = item_getCart();
	
	// Check if cookies have any values
	if (shoppingCart == null) {
		// Create the cookie and set it
		cookie_set(shoppingCartName, "[{\"id\":" + id + ",\"amount\": 1}]");
		return;
	}
	
	// Check if the value exists in the shopping cart
	if (item_existsInCart(id)) {
		for (let i = 0; i < shoppingCart.length; i++) {
			// Item in question 
			let item = shoppingCart[i];
			
			// If it does...
			if (item["id"] == id) {
				// Increment it and set flag to true
				item["amount"]++;
			}
		}
	}
	
	// If not found...
	else {
		// Now append this shopping cart array
		let item = { "id": id, "amount": 1 }
		shoppingCart.push(item);
	}
	
	// Set new shopping cart to cookie
	cookie_set(shoppingCartName, JSON.stringify(shoppingCart));
}

// Set cart item to a valud 
function item_setAmount(id, amount) {
	
	// if not valid amount, don't continue 
	if (amount < 0) {
		return;
	}
	
	// Get items 
	let items = item_getCart();
	
	// Find value, if doesn't exist, create it
	// The cookie cart cookie name 
	const shoppingCartName = "cs_shoppingcart";
	
	// Assume we have values, we first decode the cookie value 
	let shoppingCart = item_getCart();
	
	// If the amount is zero, we will remove it
	if (amount == 0) {
		// Add all cookies beside our current ID.
		if (items == null) {
			return; 
		}
		
		// Otherwise, just set everything else
		for (let i = 0; i < shoppingCart.length; i++) {
			// This is the item in question 
			let item = shoppingCart[i]
			
			if (item.id == id) {
				// Kill item
				shoppingCart.splice(i, 1);
				
				// Decrement
				i--;
			}
		}
		
		// Set new shopping cart to cookie
		cookie_set(shoppingCartName, JSON.stringify(shoppingCart));
	}
	
	// Check if cookies have any values
	if (shoppingCart == null) {
		// Create the cookie and set it
		cookie_set(shoppingCartName, "[{\"id\":" + id + ",\"amount\":1}]");
		return;
	}
	
	// Check if the value exists in the shopping cart
	if (item_existsInCart(id)) {
		for (let i = 0; i < shoppingCart.length; i++) {
			// Item in question 
			let item = shoppingCart[i];
			
			// If it does...
			if (item["id"] == id) {
				// Increment it and set flag to true
				item["amount"] = amount;
			}
		}
	}
	
	// If not found...
	else {
		// Now append this shopping cart array
		let item = { "id": id, "amount": 1 }
		shoppingCart.push(item);
	}
	
	// Set new shopping cart to cookie
	cookie_set(shoppingCartName, JSON.stringify(shoppingCart));
}

// Place items in cart 
function cart_place() {
	// Get all items 
	let items = item_getCart();
	if (items == null) {
		return;
	}
	
	// Get the cart element 
	let eCart = $("#cart-tbl-body");
	eCart.empty();
	
	// Create a fragment 
	let eFrag = $( document.createDocumentFragment() );
	
	// For all items
	for (let i = 0; i < items.length; i++) {
		// This item 
		let item = items[i];
		
		// Create element
		let eRow = $( document.createElement("tr") );
		eRow.addClass("cart-tbl-row");
		
		// Element ID 
		const ID = item["id"];
		const AMOUNT = item["amount"];
		
		// Create ID Row 
		let eIDD = $( document.createElement("td") );
		eIDD.text("Item #" + ID);
		eIDD.addClass("cart-tbl-data");
		eRow.append(eIDD);
		
		// Create Image Row
		let eImageD = $( document.createElement("td") );
		eImageD.addClass("cart-tbl-data");
		
		let eImage = $( document.createElement("img") );
		eImage.attr("src", "./img/item/" + ID + ".jpeg");
		eImageD.append(eImage);
		eRow.append(eImageD);
		
		// Create Name Row 
		let eNameD = $( document.createElement("td") );
		eNameD.addClass("cart-tbl-data");
		eRow.append(eNameD);
		
		// Create Stock Row
		let eStockD = $( document.createElement("td") );
		eStockD.addClass("cart-tbl-data");
		eRow.append(eStockD);
		
		// Create amount row
		let eAmountD = $( document.createElement("td") );
		eAmountD.addClass("cart-tbl-data");
		
		let eAmount = $( document.createElement("input") );
		eAmount.attr("type", "number");
		eAmount.val(AMOUNT);
		
		eAmountD.append(eAmount);
		eRow.append(eAmountD);
		
		// Create total price
		let ePriceD = $( document.createElement("td") );
		ePriceD.addClass("cart-tbl-data");
		eRow.append(ePriceD);
		
		// Set all values using this one simple trick!
		// PHP devs HATE him!
		let addItem = function(item) {
			eNameD.text(item["name"]);
			eStockD.text(item["stock"]);
			
			// The amount now, is the value in the element 
			let newAmount = eAmount.val();
			
			// If this amount is lower than 1, set to 1
			if (newAmount < 1) {
				eAmount.val(1);
				newAmount = 1;
			}
			
			let newPrice = newAmount*item["price"];
			ePriceD.text('$' + newPrice);
			
			// Set total price
			cart_totalPrice();
		};
		
		eAmount.change(function() {
			// The amount now, is the value in the element 
			let newAmount = eAmount.val();
			
			// Change the cookie as well
			item_load(ID, addItem);
			item_setAmount(ID, newAmount);
		});
		
		// Get the JSON from item.php, we can use the same code.
		let itemData = item_load(ID, addItem);
		
		eFrag.append(eRow);
	}
	
	// Append fragment to cart 
	eCart.append(eFrag);
}

// Calculate total price 
function cart_totalPrice() {
	// The total price element
	let eTotal = $("#cart-tbl-total");
	let total = 0.0;
	
	// Table body 
	let eBody = $("#cart-tbl-body");
	let eRows = eBody.children();
	
	// Get the price in the price column
	for (let i = 0; i < eRows.length; i++) {
		// The row 
		let eRow = $(eRows[i]);
		let eCol = eRow.children();

		// Add the value to the price 
		let ePrice = $(eCol[eCol.length- 1]);
		let price = ePrice.text();
		
		// Remove the first character
		price = parseInt(price.substring(1));
		total += price;
	}
	
	eTotal.text('$' + total);
}

// Set values in the HTML file 
function item_place(json) {
	
	// The ID 
	const ID = json["id"];
	
	// The hash map
	let eName = $(".item-name");
	eName.text(json["name"]);
	
	let eImage = $(".item-image");
	eImage.attr("src", "./img/item/" + ID + ".jpeg");
	
	let eButton = $(".item-btn");
	eButton.click(function() {
		item_addToCart(ID);
	});
	
	let ePrice = $(".item-price");
	ePrice.text("$" + json["price"]);
	
	let eStock = $(".item-stock");
	eStock.text(json["stock"] + " in stock");
	
	let eDesc = $(".item-desc");
	eDesc.text(json["desc"]);
}

// When we load the item
function item_load(id, onload = item_place) {
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/item.php";
	let query = "?action=get&id=" + id;
	
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
			onload(json);
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
}

// Demand an order 
function item_orderCart() {
	// Ask the cart php file
	
	// If we do not have any arguments, we will assume they want the entire DB
	const url = "https://eris.ad.murdoch.edu.au/~34829454/assignment-2/cart.php";
	let query = "";
	
	// Run the requests.
	let xhr = new XMLHttpRequest();
	const fullURL = url + query;
	xhr.open("GET", fullURL, true);
	
	// Function is called when we get it.
	xhr.onreadystatechange = function() {
		// If valid.
		if (xhr.readyState == 4 && xhr.status == 200) {
			
			// Place the query items
			let table = $("#cart-tbl");
			
			// Remove all existing banners...
			$(".cart-banner").remove();
			
			let banner = $( document.createElement("div") );
			banner.addClass("cart-banner");
			
			try {
				// Parse the JSON
				let json = JSON.parse(xhr.responseText);
				if (json["success"]) {
					// ON success
					banner.addClass("cart-success");
					banner.text("Order was successful ($" + json["cost"] +")...");
					
					// Delete from cart
					cookie_remove("cs_shoppingcart");
				} else {
					// On failure
					banner.addClass("cart-failure");
					banner.text("Order failed.");
				}
			} catch (e) {
				// On failure
				banner.addClass("cart-failure");
				banner.text("Order failed.");
			}
			
			// Add into the end 
			table.after( banner );
			
		}
	};
	
	// Send the head.
	xhr.setRequestHeader("Access-Control-Allow-Credentials", "*");
	xhr.setRequestHeader("Access-Control-Allow-Origin", "https://eris.ad.murdoch.edu.au");
	xhr.send(null);
}