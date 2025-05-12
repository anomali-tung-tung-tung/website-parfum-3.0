document.getElementById("checkout-btn").addEventListener("click", function () {
  document.getElementById("checkout-modal").classList.remove("hidden");
});

function closeModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Load cart items
  loadCartItems();
  
  // Setup event listeners
  document.getElementById('checkout-btn').addEventListener('click', showCheckoutModal);
  setupThemeToggle();
  setupHamburgerMenu();
});

// Load cart items from backend or localStorage
async function loadCartItems() {
  const cartContainer = document.getElementById('cart-items');
  const cartTotalElement = document.getElementById('cart-total');
  
  try {
    // Try to load from backend first
    const userId = localStorage.getItem('userId') || 'default-user';
    const response = await fetch(`/api/cart/${userId}`);
    
    if (response.ok) {
      const cart = await response.json();
      renderCartItems(cart.items || [], cartContainer, cartTotalElement);
      
      // Sync with localStorage
      if (cart.items && cart.items.length > 0) {
        const localCart = cart.items.map(item => ({
          id: item.product?._id || item._id,
          name: item.product?.name || 'Unknown Product',
          price: item.product?.price || 0,
          image: item.product?.imageUrl || '../asssets/default-product.jpg',
          quantity: item.quantity || 1
        }));
        localStorage.setItem('cart', JSON.stringify(localCart));
      }
    } else {
      throw new Error('Failed to load from server');
    }
  } catch (error) {
    console.log('Using local storage due to:', error);
    // Fallback to localStorage
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    renderCartItems(localCart, cartContainer, cartTotalElement);
  }
}

// Render cart items to the page
function renderCartItems(items, container, totalElement) {
  container.innerHTML = '';
  
  if (items.length === 0) {
    container.innerHTML = '<p class="empty-cart">Keranjang belanja kosong</p>';
    totalElement.textContent = '0';
    return;
  }

  let total = 0;
  
  items.forEach(item => {
    const product = item.product || item;
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    
    const price = product.price || 0;
    const quantity = item.quantity || 1;
    const subtotal = price * quantity;
    total += subtotal;
    
    itemElement.innerHTML = `
      <img src="${product.imageUrl || product.image || '../asssets/default-product.jpg'}" 
           alt="${product.name || 'Unknown Product'}">
      <div class="item-details">
        <h3>${product.name || 'Unknown Product'}</h3>
        <p class="price">Rp ${price.toLocaleString('id-ID')}</p>
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="updateQuantity('${item._id || item.id}', ${quantity - 1})">-</button>
          <span>${quantity}</span>
          <button class="quantity-btn" onclick="updateQuantity('${item._id || item.id}', ${quantity + 1})">+</button>
        </div>
        <p class="subtotal">Subtotal: Rp ${subtotal.toLocaleString('id-ID')}</p>
        <button class="remove-btn" onclick="removeItem('${item._id || item.id}')">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </div>
    `;
    
    container.appendChild(itemElement);
  });
  
  totalElement.textContent = total.toLocaleString('id-ID');
}

// Update item quantity
async function updateQuantity(itemId, newQuantity) {
  if (newQuantity < 1) {
    removeItem(itemId);
    return;
  }

  try {
    const userId = localStorage.getItem('userId') || 'default-user';
    const response = await fetch(`/api/cart/${userId}/item/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    });

    if (response.ok) {
      loadCartItems();
    } else {
      throw new Error('Failed to update quantity');
    }
  } catch (error) {
    console.error('Error updating quantity:', error);
    // Update local storage
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = localCart.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      localCart[itemIndex].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(localCart));
      loadCartItems();
    }
  }
}

// Remove item from cart
async function removeItem(itemId) {
  if (!confirm('Yakin ingin menghapus item ini?')) return;

  try {
    const userId = localStorage.getItem('userId') || 'default-user';
    const response = await fetch(`/api/cart/${userId}/item/${itemId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadCartItems();
    } else {
      throw new Error('Failed to remove item');
    }
  } catch (error) {
    console.error('Error removing item:', error);
    // Remove from local storage
    const localCart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = localCart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    loadCartItems();
  }
}

// Show checkout modal
function showCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const itemsContainer = document.getElementById('modal-cart-items');
  const totalElement = document.getElementById('modal-cart-total');
  
  // Load current cart items
  const localCart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  
  itemsContainer.innerHTML = '';
  
  localCart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'modal-cart-item';
    const subtotal = (item.price || 0) * (item.quantity || 1);
    total += subtotal;
    
    itemElement.innerHTML = `
      <p>${item.name} (${item.quantity}x)</p>
      <p>Rp ${subtotal.toLocaleString('id-ID')}</p>
    `;
    
    itemsContainer.appendChild(itemElement);
  });
  
  totalElement.textContent = total.toLocaleString('id-ID');
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  document.getElementById('checkout-modal').style.display = 'none';
}

// Process checkout
async function processCheckout() {
  // Validate form
  const name = document.getElementById('card-name').value;
  const cardNumber = document.getElementById('card-number').value;
  const expiry = document.getElementById('card-expiry').value;
  const cvv = document.getElementById('card-cvv').value;
  
  if (!name || !cardNumber || !expiry || !cvv) {
    alert('Harap lengkapi semua field pembayaran');
    return;
  }

  try {
    const userId = localStorage.getItem('userId') || 'default-user';
    const response = await fetch(`/api/cart/${userId}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentInfo: { name, cardNumber, expiry, cvv }
      })
    });

    if (response.ok) {
      alert('Pembayaran berhasil! Terima kasih telah berbelanja.');
      localStorage.removeItem('cart');
      closeModal();
      loadCartItems();
    } else {
      throw new Error('Checkout failed');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Gagal melakukan checkout. Silakan coba lagi.');
  }
}

// Theme toggle functionality
function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;


  }



// Hamburger menu functionality
function setupHamburgerMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Animate hamburger bars
    const bars = hamburger.querySelectorAll('.bar');
    if (hamburger.classList.contains('active')) {
      bars[0].style.transform = 'translateY(8px) rotate(45deg)';
      bars[1].style.opacity = '0';
      bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      bars[0].style.transform = 'translateY(0) rotate(0)';
      bars[1].style.opacity = '1';
      bars[2].style.transform = 'translateY(0) rotate(0)';
    }
  });
}