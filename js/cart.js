// === Keranjang Belanja ===
document.addEventListener('DOMContentLoaded', function () {
    // Load dan render isi keranjang
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
  
    let total = 0;
    cartItems.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${item.image}" alt="${item.name}" />
        <div class="details">
          <h4>${item.name}</h4>
          <p>Rp ${item.price}</p>
          <button onclick="removeItem(${index})">Hapus</button>
        </div>
      `;
      cartContainer.appendChild(itemEl);
      total += item.price;
    });
  
    cartTotal.textContent = total.toLocaleString('id-ID');
  
    // === Hamburger Menu ===
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
  
    if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
      });
    }
  });
  
  function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    location.reload();
  }
  
  function checkout() {
    alert("Terima kasih telah berbelanja di MAHA PARFUME!");
    localStorage.removeItem('cart');
    location.reload();
  }
  