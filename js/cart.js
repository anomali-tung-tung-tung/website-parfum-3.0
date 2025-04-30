document.addEventListener('DOMContentLoaded', function () {
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
