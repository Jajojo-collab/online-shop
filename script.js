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

// 🆕 Cart-Daten für Checkout speichern
function prepareCheckoutData() {
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const summary = {
    cartItems: cart,
    shipping: 5,
    total: total + 5
  };
  localStorage.setItem("checkoutData", JSON.stringify(summary));
}

// 🆕 checkout.html – Cart-Daten anzeigen
function renderCheckoutPage() {
  const data = JSON.parse(localStorage.getItem("checkoutData"));
  if (!data) return;

  const productSummary = document.querySelector(".product-summary");
  const priceSummary = document.querySelector(".price-summary");

  if (!productSummary || !priceSummary) return;

  productSummary.innerHTML = "";
  data.cartItems.forEach(item => {
    const el = document.createElement("p");
    el.innerHTML = `${item.name} (Size: ${item.size}) x${item.quantity} <span>${(item.price * item.quantity).toFixed(2)} CHF</span>`;
    productSummary.appendChild(el);
  });

  priceSummary.innerHTML = `
    <p>Subtotal <span>${(data.total - data.shipping).toFixed(2)} CHF</span></p>
    <p>Shipping <span>${data.shipping.toFixed(2)} CHF</span></p>
    <p class="total">TOTAL <span>${data.total.toFixed(2)} CHF</span></p>
  `;
}

// Event Listener für Produktseite & Cart
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCartItems();
  renderCheckoutPage(); // 🆕

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

  // 🆕 Checkout vorbereiten & Cart löschen beim Button-Klick (auf cart.html)
  const checkoutBtn = document.querySelector(".checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      prepareCheckoutData();
      localStorage.removeItem("cart");       // 🧹 Cart leeren
      updateCartCount();                     // 🆙 Cart Count updaten
    });
  }

  // 🆕 Cart löschen beim Order-Submit (auf checkout.html)
  const orderBtn = document.querySelector(".order");
  if (orderBtn) {
    orderBtn.addEventListener("click", () => {
      localStorage.removeItem("cart");
      localStorage.removeItem("checkoutData");
    });
  }
});