
// Fetch products from JSON file
fetch('data.json')
    .then(response => response.json())
    .then(products => {
        displayProducts(products);
    })
    .catch(error => console.error('Error fetching products:', error));

let cart = [];

// Function to display products
function displayProducts(products)
{
    var productList = document.getElementById('product-list');
    productList.innerHTML = '';

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const productDiv = document.createElement('div');
      productDiv.classList.add('product');
      productDiv.innerHTML = `
          <picture >
              <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
              <source media="(min-width: 768px)" srcset="${product.image.tablet}">
              <source media="(min-width: 480px)" srcset="${product.image.mobile}">
              <img src="${product.image.thumbnail}" alt="${product.name}">
          </picture>
           
          <div class="quantity-controls" id="quantity-controls-${product.name.replace(/\s+/g, '-')}" style="display: none;">
              <button onclick="updateQuantity('${product.name}', -1)">–</button>
              <span id="quantity-${product.name.replace(/\s+/g, '-')}" class="quantity">0</span>
              <button onclick="updateQuantity('${product.name}', 1)">+</button>
          </div>
          
          <div class="add-item">
            <button class="addtocart" id="add-to-cart-${product.name.replace(/\s+/g, '-')}" onclick="addToCart('${product.name}', ${product.price}, this)">
            <img class="add-to-cart-img" src="assets/images/icon-add-to-cart.svg" alt="">
            <span>Add to Cart</span>
            </button>
          </div>

          <div class="product-info">
            <p class="categ">${product.category}</p>
            <h3>${product.name}</h3>
            <p class="Price">$${product.price.toFixed(2)}</p>
          </div>
      `;
      productList.appendChild(productDiv);
  }
  

}

// Function to add products to the cart
// function addToCart(name, price, button) {
//   const cartItem = cart.find(item => item.name === name);
//   const controls = document.getElementById(`quantity-controls-${name.replace(/\s+/g, '-')}`);
//   const quantityDisplay = document.getElementById(`quantity-${name.replace(/\s+/g, '-')}`);
//   const emptyCartMessage = document.getElementById('empty-cart-message'); // Get the placeholder element

//   if (cartItem) {
//       cartItem.quantity++;
//   } else {
//       cart.push({ name, price, quantity: 1 });
//   }

//   // Hide the "Add to Cart" button and show quantity controls
//   controls.style.display = 'flex';
//   button.style.display = 'none'; 
//   quantityDisplay.textContent = cartItem ? cartItem.quantity : 1;

//   // Hide the empty cart message when a product is added
//   emptyCartMessage.style.display = 'none';

//   updateCart();
// }


// Function to add products to the cart
function addToCart(name, price, button) {
  const productDiv = button.closest('.product'); // Get the parent product div
  const imgElement = productDiv.querySelector('img'); // Find the image element
  const imageUrl = imgElement.src; // Get the image URL

  const cartItem = cart.find(item => item.name === name);
  const controls = document.getElementById(`quantity-controls-${name.replace(/\s+/g, '-')}`);
  const quantityDisplay = document.getElementById(`quantity-${name.replace(/\s+/g, '-')}`);
  const emptyCartMessage = document.getElementById('empty-cart-message');

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1, image: imageUrl });
  }

  // Hide the "Add to Cart" button and show quantity controls
  controls.style.display = 'flex';
  button.style.display = 'none'; 
  quantityDisplay.textContent = cartItem ? cartItem.quantity : 1;

  emptyCartMessage.style.display = 'none';

  updateCart();
}



// Function to update product quantity
function updateQuantity(name, change) {
    const cartItem = cart.find(item => item.name === name);
    const quantityDisplay = document.getElementById(`quantity-${name.replace(/\s+/g, '-')}`);
    
    if (cartItem) {
        cartItem.quantity += change;
        if (cartItem.quantity <= 0) {
            cart = cart.filter(item => item.name !== name); // Remove item if quantity is 0
            const controls = document.getElementById(`quantity-controls-${name.replace(/\s+/g, '-')}`);
            controls.style.display = 'none'; // Hide controls when no items left
            const button = document.getElementById(`add-to-cart-${name.replace(/\s+/g, '-')}`);
            button.style.display = 'block'; // Show "Add to Cart" button again
        }
        quantityDisplay.textContent = cartItem.quantity; // Update quantity display
    }

    updateCart();
}

// Function to update cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const displayPrice = document.getElementById('displayprice');
  const emptyCartImg = document.getElementById('empty-cart-img');
  const carbon = document.getElementById('carbon');


  

  const confirmOrderBtn = document.getElementById('confirm-order-btn');
  const emptyCartMessage = document.getElementById('empty-cart-message'); // Get the placeholder element


  
  cartItems.innerHTML = ''; // Clear cart items
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;

      const cartItemDiv = document.createElement('div');
      cartItemDiv.innerHTML = `
        <div class="product-container">
          <p class="product-name">${item.name} </p>
          

          <div class="product-details">
            <p class="quan">${item.quantity}x </p>
            <p class="prices">
              <span class="price-one">@ $${item.price} </span>
              <span class="price-two">$${(item.price * item.quantity).toFixed(2)} </span>
            </p>
            <button onclick="removeFromCart('${item.name}')" class="delete-item"><i class="fa-solid fa-x"></i></button>
          </div>
        </div>
          



          
          
          
          
          
      `;
      cartItems.appendChild(cartItemDiv);
  });

  cartCount.textContent = totalItems;
  cartTotal.textContent = totalPrice.toFixed(2);

  // Hide the total and confirm button if cart is empty
  if (totalItems > 0) {
      displayPrice.style.display = 'flex';
      cartTotal.style.display = 'inline-block';
      confirmOrderBtn.style.display = 'block';
      emptyCartMessage.style.display = 'none'; // Hide the placeholder message
      emptyCartImg.style.display='none';
      carbon.style.display='block';


  } else {
      displayPrice.style.display = 'none';
      cartTotal.style.display = 'none';
      confirmOrderBtn.style.display = 'none';
      emptyCartMessage.style.display = 'block'; // Show the placeholder message
      emptyCartImg.style.display='block';
      carbon.style.display='none';


  }
}



// Function to remove item from cart
function removeFromCart(name) {
    cart = cart.filter(item => item.name !== name);
    updateCart();
}

// Event listener for Confirm Order button
// document.getElementById('confirm-order-btn').addEventListener('click', () => {
//   const confirmationSection = document.getElementById('confirmation');
//   const confirmationItems = document.getElementById('confirmation-items');
//   const orderTotal = document.getElementById('order-total');
//   const cartSection = document.getElementById('cart-section');
//   const confirmationModal = document.getElementById('confirmation-modal');

//   confirmationItems.innerHTML = '';
//   let totalPrice = 0;

//   cart.forEach(item => {
//       const confirmationItem = document.createElement('div');
//       const itemTotal = item.price * item.quantity;
//       confirmationItem.textContent =
//        `
        

//        ${item.name} x${item.quantity} $${itemTotal.toFixed(2)}
       
       
       
//        `;
//       confirmationItems.appendChild(confirmationItem);
//       totalPrice += itemTotal;
//   });

//   orderTotal.textContent = `$${totalPrice.toFixed(2)}`;

//   // cartSection.style.display = 'none';
//   confirmationModal.style.display = 'block'; // Show the modal
// });


// Event listener for Confirm Order button
document.getElementById('confirm-order-btn').addEventListener('click', () => {
  const confirmationItems = document.getElementById('confirmation-items');
  const orderTotal = document.getElementById('order-total');
  const confirmationModal = document.getElementById('confirmation-modal');

  confirmationItems.innerHTML = ''; // Clear the confirmation section
  let totalPrice = 0;

  // Loop through the cart and display the products in the confirmation modal
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    // Create a div for each item in the confirmation modal
    const confirmationItemDiv = document.createElement('div');
    confirmationItemDiv.classList.add('confirmation-item');
    confirmationItemDiv.innerHTML = `
      <div class="confirmation-item-details">
        <img src="${item.image}" alt="${item.name}" class="confirmation-item-img" />
        <div class="confirmation-item-info">
          <p class="product-name">${item.name}</p>
          <div class="confirmation-price">
              <p class="quan">${item.quantity}x</p>
              <span class="price-one">@ $${item.price}</span>
          </div>
          
        </div>
        <div class="price-two-container"><p class="price-two">$${(item.price * item.quantity).toFixed(2)} </p></div>

      </div>
    `;

    confirmationItems.appendChild(confirmationItemDiv); // Append each product to the confirmation modal
  });

  // Update the total price in the modal
  orderTotal.textContent = `$${totalPrice.toFixed(2)}`;

  // Show the confirmation modal
  confirmationModal.style.display = 'block';
});



// Event listener for Start New Order button
document.getElementById('new-order-btn').addEventListener('click', () => {
  // Clear the cart
  cart = [];
  updateCart();

  // Hide the confirmation modal and show the cart section again
  const confirmationModal = document.getElementById('confirmation-modal');
  confirmationModal.style.display = 'none'; // Hide the modal
  document.getElementById('cart-section').style.display = 'block'; // Show the cart section again

  // Reset all quantity controls and buttons to their original state
  const quantityControls = document.querySelectorAll('.quantity-controls');
  quantityControls.forEach(control => {
      control.style.display = 'none'; // Hide quantity controls
  });

  const addToCartButtons = document.querySelectorAll('[id^="add-to-cart-"]');
  addToCartButtons.forEach(button => {
      button.style.display = 'block'; // Show "Add to Cart" buttons
  });
});

// Function to remove item from cart
function removeFromCart(name) {
  // Remove the item from the cart
  cart = cart.filter(item => item.name !== name);
  
  // Update the cart display
  updateCart();
  
  // Reset the product's "Add to Cart" button and quantity controls
  const controls = document.getElementById(`quantity-controls-${name.replace(/\s+/g, '-')}`);
  controls.style.display = 'none'; // Hide the quantity controls
  
  const button = document.getElementById(`add-to-cart-${name.replace(/\s+/g, '-')}`);
  button.style.display = 'block'; // Show the "Add to Cart" button again
}


















