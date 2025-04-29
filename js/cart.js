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

//checkout
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    alert("Kamu belum memilih barang");
    return;
  }

  alert("Terima kasih telah berbelanja di MAHA PARFUME!");
  localStorage.removeItem('cart');
  location.reload();
}

// Global functions
function removeItem(index) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

// Hamburger menu logic
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
