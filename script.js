// script.js

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("product.html")) {
    getSingleGarment();
  }
  if (window.location.pathname.includes("shop.html")) {
    loadProducts();
  }
});

async function getAllGarments() {
  try {
    const response = await fetch('https://pb28.toiwxr.easypanel.host/api/collections/styleX/records', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Fehler beim Abrufen der Kleidungsstücke:", error);
    alert("Ein Fehler ist aufgetreten beim Abrufen der Kleidungsstücke.");
    return [];
  }
}

function getImageUrl(item, index = 0) {
  if (!item || !item.Pictures || !item.id || item.Pictures.length === 0) return 'assets/placeholder.jpg';
  return `https://pb28.toiwxr.easypanel.host/api/files/styleX/${item.id}/${item.Pictures[index]}`;
}

function renderProductCard(item) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-id', item.id);
  card.setAttribute('data-name', item.Garment);
  card.setAttribute('data-price', item.Price);
  card.setAttribute('data-category', item.category);
  card.setAttribute('data-pictures', item.Pictures);

  card.innerHTML = `
    <a href="product.html?id=${item.id}">
      <img src="${getImageUrl(item)}" alt="${item.Garment}">
      <h3>${item.Garment}</h3>
      <p>styleX</p>
      <span>${item.Price} CHF</span>
    </a>
  `;

  return card;
}

async function loadProducts() {
  const grid = document.getElementById('product-grid');
  const products = await getAllGarments();

  products.forEach(item => {
    const card = renderProductCard(item);
    grid.appendChild(card);
  });
}

async function getSingleGarment() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  try {
    const response = await fetch(`https://pb28.toiwxr.easypanel.host/api/collections/styleX/records/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    document.querySelector("#Price").textContent = data.Price.toFixed(2) + "CHF" || "";
    document.querySelector("#Garment").textContent = data.Garment || "";
    document.querySelector("#description").innerHTML = data.Description || "Keine Beschreibung verfügbar";
    document.querySelector("#Weight").innerHTML = data.Weight || "Kein Gewicht verfügbar";
    document.querySelector("#Dimensions").innerHTML = data.Dimensions || "Keine Masse verfügbar";
    document.querySelector("#Pictures").innerHTML = data.Pictures || "Keine Bilder verfügbar";

    // Hauptbild anzeigen
const mainImg = document.getElementById("main-image");
if (mainImg) {
  mainImg.src = getImageUrl(data, 0);
}

// Thumbnails rendern
const thumbsContainer = document.getElementById("thumbnails");
thumbsContainer.innerHTML = "";

data.Pictures.forEach((pic, i) => {
  const img = document.createElement("img");
  img.src = getImageUrl(data, i);
  img.alt = "Thumbnail";
  img.className = "thumb";
  img.style = "width: 60px; cursor: pointer; margin-right: 5px; border-radius: 4px;";

  img.addEventListener("click", () => {
    mainImg.src = img.src;
  });

  thumbsContainer.appendChild(img);
});


  } catch (error) {
    console.error("Fehler beim Abrufen des Kleidungsstücks:", error);
    alert("Ein Fehler ist aufgetreten beim Abrufen des Kleidungsstücks.");
  }
}

async function addContact() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const message = document.getElementById("message").value;
  const fileInput = document.getElementById("file-upload");

  if (!name || !email || !message || !phone) {
    alert("Bitte fülle alle Felder aus.");
    return;
  }

  const formData = new FormData();
  formData.append("Name", name);
  formData.append("E_Mail", email);
  formData.append("Telefon_nr", phone);
  formData.append("Message", message);

  if (fileInput.files.length > 0) {
    formData.append("Anhang", fileInput.files[0]);
  }

  try {
    const response = await fetch('https://pb28.toiwxr.easypanel.host/api/collections/Contact/records', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Fehler beim Speichern:", errorData);
      alert("Ein Fehler ist aufgetreten beim Speichern.");
      return;
    }

    const result = await response.json();
    console.log("Gespeichert:", result);
  } catch (error) {
    console.error("Netzwerkfehler:", error);
  }
}




// async function getProductById(id) {
//   const id = new URLSearchParams(window.location.search).get("id");
//   if (!id) return;

//   try {
//     const pb = new PocketBase("http://127.0.0.1:8090");
//     const item = await pb.collection("kleider").getOne(id);

//     // Jetzt kannst du das HTML befüllen
//     document.querySelector(".product-title").textContent = item.title;
//     document.querySelector(".product-price").textContent = parseFloat(item.price).toFixed(2) + " CHF";
//     document.querySelector(".product-description").textContent = item.description || "Keine Beschreibung verfügbar";
//     // usw.

//   } catch (error) {
//     console.error("Fehler beim Laden des Produkts:", error);
//   }
// }




async function fetchKleider() {
  try {
    const result = await pb.collection('kleider').getFullList({
      sort: '-created',
    });

    const grid = document.querySelector('.grid');
    grid.innerHTML = ''; // Vorhandene statische Karten entfernen

    result.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('product-card');

      card.innerHTML = `
        <img src="assets/placeholder.jpg" style="border-radius: 8px; width: 100%; margin-bottom: 0.5rem;">
        <h3>${item.title}</h3>
        <p>styleX</p>
        <span>${item.price.toFixed(2)} CHF</span>
      `;

      grid.appendChild(card);
    });

  } catch (err) {
    console.error('Fehler beim Abrufen der Daten:', err);
  }
}
fetchKleider();



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