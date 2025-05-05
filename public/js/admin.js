document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const orderList = document.getElementById('order-list');
  
    // Fungsi untuk memuat produk dari API
    async function loadProducts() {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const products = await response.json();
        productList.innerHTML = '';
        products.forEach(product => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td>
              <button onclick="deleteProduct('${product._id}')">Hapus</button>
            </td>
          `;
          productList.appendChild(row);
        });
      } catch (error) {
        console.error('Error loading products:', error);
      }
    }
  
    // Fungsi untuk memuat pesanan dari API
    async function loadOrders() {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        const orders = await response.json();
        orderList.innerHTML = '';
        orders.forEach(order => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${order._id}</td>
            <td>${order.user}</td>
            <td>${order.total}</td>
            <td>${order.paymentStatus}</td>
            <td>
              <button onclick="updateOrderStatus('${order._id}')">Ubah Status</button>
            </td>
          `;
          orderList.appendChild(row);
        });
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  
    // Fungsi untuk menghapus produk
    async function deleteProduct(productId) {
      if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        try {
          const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
            method: 'DELETE',
          });
          if (response.ok) {
            loadProducts();  // Reload produk setelah dihapus
          }
        } catch (error) {
          console.error('Error deleting product:', error);
        }
      }
    }
  
    // Fungsi untuk mengubah status pesanan
    async function updateOrderStatus(orderId) {
      const newStatus = prompt('Masukkan status baru untuk pesanan:');
      if (newStatus) {
        try {
          const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentStatus: newStatus }),
          });
          if (response.ok) {
            loadOrders();  // Reload pesanan setelah status diubah
          }
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      }
    }
  
    // Muat produk dan pesanan saat halaman dimuat
    loadProducts();
    loadOrders();
  });
  