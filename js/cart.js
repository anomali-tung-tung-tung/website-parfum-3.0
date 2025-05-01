document.addEventListener('DOMContentLoaded', function () {
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
    total += parseInt(item.price.replace(/\./g, ''));
  });

  cartTotal.textContent = ` ${total.toLocaleString('id-ID')}`;
});

// === Checkout ===
function checkout() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  if (cartItems.length === 0) {
    alert("Keranjang belanja Anda kosong!");
    return;
  }
  
  // Show the payment modal
  document.getElementById('checkout-modal').style.display = 'block';
  
  // Update modal content
  updateModalCart();
}

function closeModal() {
  document.getElementById('checkout-modal').style.display = 'none';
}

function updateModalCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
  const modalCartItems = document.getElementById('modal-cart-items');
  const cartCount = document.getElementById('cart-count');
  const modalCartTotal = document.getElementById('modal-cart-total');
  
  modalCartItems.innerHTML = '';
  let total = 0;
  
  cartItems.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.innerHTML = `<p>${item.name} <span class="price">Rp ${item.price}</span></p>`;
    modalCartItems.appendChild(itemEl);
    total += parseInt(item.price.replace(/\./g, ''));
  });
  
  cartCount.textContent = cartItems.length;
  modalCartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// === Hapus Item dari Keranjang ===
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

// === Hamburger Menu ===
document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', function () {
    this.classList.toggle('active');
    navLinks.classList.toggle('active');

    const bars = this.querySelectorAll('.bar');
    if (this.classList.contains('active')) {
      bars[0].style.transform = 'translateY(8px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      bars[0].style.transform = 'translateY(0) rotate(0)';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'translateY(0) rotate(0)';
    }
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      const bars = hamburger.querySelectorAll('.bar');
      bars[0].style.transform = 'translateY(0) rotate(0)';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'translateY(0) rotate(0)';
    });
  });
});
