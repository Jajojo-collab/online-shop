document.addEventListener('DOMContentLoaded', () => {
 
  // === PRODUKTFILTER ===
  const filterButtons = document.querySelectorAll('.filters [data-filter]');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const selectedCategory = button.getAttribute('data-filter').toLowerCase();

      productCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category').toLowerCase();

        if (selectedCategory === 'all' || cardCategory === selectedCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });

      // Aktiven Button visuell hervorheben
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  // === LAGERBEGRENZUNG FÜR MENGENAUSWAHL ===
  const input = document.getElementById('quantity');
  const stockElement = document.querySelector('.stock');
  const maxStock = parseInt(stockElement?.getAttribute('data-stock') || "99");

  if (input) {
    input.max = maxStock;
  }

  // === ADD TO CART BUTTONS ===
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const productCard = e.target.closest('.product-info');
      if (!productCard) return;

      const id = document.querySelector('.sku')?.innerText.replace('SKU: ', '') || 'LP123';
      const name = productCard.querySelector('h2')?.innerText || 'Produkt';
      const price = productCard.querySelector('.price')?.innerText.replace('CHF', '').trim() || '0';
      const size = document.getElementById('size')?.value || 'default';
      const quantity = parseInt(document.getElementById('quantity')?.value || '1');

      console.log("Zum Warenkorb hinzugefügt:", { id, name, price, size, quantity });

      button.innerText = 'added ✅';
      button.disabled = true;
      setTimeout(() => {
        button.innerText = 'Add to Cart';
        button.disabled = false;
      }, 1500);
    });
  });

  // === MENGEN-PLUS-MINUS BUTTONS ===
  const increaseBtn = document.getElementById('increase-btn');
  const decreaseBtn = document.getElementById('decrease-btn');

  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => {
      const current = parseInt(input.value);
      if (current < maxStock) {
        input.value = current + 1;
      }
    });
  }

  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => {
      const current = parseInt(input.value);
      if (current > 1) {
        input.value = current - 1;
      }
    });
  }
});
