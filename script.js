// script.js

// Cart aus localStorage laden
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.querySelectorAll("#cart-count");
  cartCount.forEach(el => el.textContent = count);
}

// Produkt zur Cart hinzufügen
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.name === product.name && item.size === product.size);
  if (existing) {
    existing.quantity += product.quantity;
  } else {
    cart.push(product);
  }
  saveCart(cart);
  updateCartCount();
}

// cart.html – Produkte anzeigen
function renderCartItems() {
  const cartItemsContainer = document.getElementById("cart-items");
  if (!cartItemsContainer) return;

  const cart = getCart();
  cartItemsContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p><strong>${item.name}</strong> (Size: ${item.size})</p>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: ${item.price.toFixed(2)} CHF</p>
    `;
    cartItemsContainer.appendChild(div);
  });

  // Summary updaten
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-item-count").textContent = `(${itemsCount} Items)`;
  document.getElementById("summary-items").textContent = itemsCount;
  document.getElementById("summary-total").textContent = (total + 5).toFixed(2) + " CHF";
}

// Event Listener für Produktseite
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartItems();

  const addBtn = document.querySelector(".add-to-cart-btn");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const name = document.querySelector(".product-info h2").textContent;
      const price = parseFloat(document.querySelector(".price").textContent.replace("$", ""));
      const size = document.getElementById("size").value;
      const quantity = parseInt(document.getElementById("quantity").value);

      const product = { name, price, size, quantity };
      addToCart(product);
   
    });
  }

  const increaseBtn = document.getElementById("increase-btn");
  const decreaseBtn = document.getElementById("decrease-btn");
  const quantityInput = document.getElementById("quantity");

  if (increaseBtn && decreaseBtn && quantityInput) {
    increaseBtn.addEventListener("click", () => {
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    decreaseBtn.addEventListener("click", () => {
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
  }
});