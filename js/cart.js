document.addEventListener('DOMContentLoaded', function () {
<<<<<<< HEAD
  loadCartItems();

  // Hamburger Menu
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  if (menuToggle && navLinks) {
      menuToggle.addEventListener('click', function () {
          navLinks.classList.toggle('active');
      });
  }
});

async function loadCartItems() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  cartContainer.innerHTML = '';
  let total = 0;

  try {
      // Ambil data cart dari server
      const response = await fetch('/api/cart');
      const cartItems = await response.json();

      cartItems.forEach((item, index) => {
          const itemEl = document.createElement('div');
          itemEl.className = 'cart-item';
          const productName = item.productId?.name || 'Produk Tidak Diketahui';
          const productPrice = item.productId?.price || '0';
          const productImage = item.productId?.image || 'default.jpg'; // Jika ada default img

          itemEl.innerHTML = `
              <img src="${productImage}" alt="${productName}" />
              <div class="details">
                  <h4>${productName}</h4>
                  <p>Rp ${parseInt(productPrice).toLocaleString('id-ID')}</p>
                  <button onclick="removeItem('${item._id}')">Hapus</button>
              </div>
          `;

          cartContainer.appendChild(itemEl);

          total += parseInt(productPrice);
      });

      cartTotal.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  } catch (error) {
      console.error('Gagal memuat cart:', error);
  }
}

async function removeItem(id) {
  if (confirm('Yakin mau hapus item ini?')) {
      try {
          await fetch(`/api/cart/${id}`, {
              method: 'DELETE'
          });
          alert('Item berhasil dihapus!');
          loadCartItems(); // Reload tampilan cart
      } catch (error) {
          console.error('Gagal menghapus item:', error);
      }
  }
}

async function checkout() {
  if (confirm('Yakin ingin checkout semua barang?')) {
      try {
          await fetch('/api/cart/clear', { method: 'DELETE' });
          alert("Terima kasih telah berbelanja di MAHA PARFUME!");
          loadCartItems();
      } catch (error) {
          console.error('Gagal checkout:', error);
      }
  }
}
=======
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
>>>>>>> c7e081e41c6a98bc8d56a954fa308e5600371f51
