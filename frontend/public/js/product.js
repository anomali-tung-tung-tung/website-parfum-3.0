document.addEventListener('DOMContentLoaded', async () => {
  const API_URL = window.location.hostname.includes('localhost') 
    ? 'http://localhost:3001' 
    : 'http://product:3001';

  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch(`${API_URL}/products`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });

    if (!response.ok) throw new Error('Gagal fetch produk');

    const products = await response.json();
    
    const container = document.getElementById('products-container');
    container.innerHTML = products.map(product => `
      <div class="product-card" data-id="${product._id}">
        <img src="${product.image || 'default.jpg'}" onerror="this.src='default.jpg'">
        <h3>${product.name}</h3>
        <p>Rp${product.price.toLocaleString('id-ID')}</p>
        <button class="add-to-cart" ${!token ? 'disabled' : ''}>
          ${token ? 'Add to Cart' : 'Login to Buy'}
        </button>
      </div>
    `).join('');

    // Event listener tombol Add to Cart
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', async () => {
        const productId = btn.closest('.product-card').dataset.id;
        const product = products.find(p => p._id === productId);

        try {
          const cartAPI = window.location.hostname.includes('localhost') 
            ? 'http://localhost:3002/cart' 
            : 'http://cart:3002/cart';

          const res = await fetch(cartAPI, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              userId: localStorage.getItem('userId'),
              productId: product._id,
              quantityChange: 1
            })
          });

          if (!res.ok) throw new Error('Gagal tambah ke keranjang');

          alert('Produk ditambahkan ke keranjang!');
        } catch (error) {
          console.error('Gagal tambah produk:', error);
        }
      });
    });
  } catch (error) {
    console.error('Gagal memuat produk:', error);
  }
});
