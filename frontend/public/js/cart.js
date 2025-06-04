document.addEventListener('DOMContentLoaded', async () => {
  const API_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:3002'
    : 'http://order:3002';

  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');

  if (!token || !userId) {
    window.location.href = '/login.html';
    return;
  }

  async function loadCart() {
    try {
      const response = await fetch(`${API_URL}/orders/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const items = await response.json();
      
      const cartContainer = document.getElementById('cart-items');
      const totalElement = document.getElementById('cart-total');
      
      if (items.length === 0) {
        cartContainer.innerHTML = '<p>Your cart is empty</p>';
        totalElement.textContent = '0';
        return;
      }

      cartContainer.innerHTML = items.map(item => `
        <div class="cart-item" data-id="${item.productId}">
          <img src="${item.image || 'default.jpg'}">
          <div>
            <h3>${item.name}</h3>
            <p>Rp${item.price.toLocaleString('id-ID')}</p>
            <div class="quantity">
              <button class="decrement">-</button>
              <span>${item.quantity}</span>
              <button class="increment">+</button>
            </div>
            <button class="remove">Remove</button>
          </div>
        </div>
      `).join('');

      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      totalElement.textContent = total.toLocaleString('id-ID');

      // Add event listeners
      document.querySelectorAll('.decrement').forEach(btn => {
        btn.addEventListener('click', async () => {
          const itemId = btn.closest('.cart-item').dataset.id;
          await updateQuantity(itemId, -1);
        });
      });

      document.querySelectorAll('.increment').forEach(btn => {
        btn.addEventListener('click', async () => {
          const itemId = btn.closest('.cart-item').dataset.id;
          await updateQuantity(itemId, 1);
        });
      });

      document.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', async () => {
          const itemId = btn.closest('.cart-item').dataset.id;
          if (confirm('Remove this item?')) {
            await removeItem(itemId);
          }
        });
      });

    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  }

  async function updateQuantity(productId, change) {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          productId,
          quantityChange: change
        })
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  }

  async function removeItem(productId) {
    try {
      await fetch(`${API_URL}/orders/${userId}/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      await loadCart();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  }

  document.getElementById('checkout-btn')?.addEventListener('click', async () => {
    try {
      await fetch(`${API_URL}/orders/checkout/${userId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert('Checkout successful!');
      await loadCart();
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  });

  loadCart();
});