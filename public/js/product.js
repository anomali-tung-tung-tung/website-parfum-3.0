document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk menampilkan popup
    function showPopup() {
      const popup = document.getElementById('popup');
      if (popup) {
        popup.style.display = 'flex';
      }
    }
  
    // Fungsi untuk menutup popup
    function closePopup() {
      const popup = document.getElementById('popup');
      if (popup) {
        popup.style.display = 'none';
      }
    }
  
    // Tutup popup ketika klik tombol close
    const closePopupBtn = document.getElementById('closePopupBtn');
    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', closePopup);
    }
  
    // User ID (sementara menggunakan default)
    const userId = 'user-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
  
    // Fungsi untuk mendapatkan data produk dari card
    function getProductData(productCard) {
      try {
        const titleElement = productCard.querySelector('.card__title');
        const priceElement = productCard.querySelector('.card__description');
        const imageElement = productCard.querySelector('img');
        
        if (!titleElement || !priceElement || !imageElement) {
          throw new Error('Elemen produk tidak ditemukan');
        }
  
        const priceText = priceElement.textContent
          .replace('Rp', '')
          .replace(/\./g, '')
          .trim();
        
        return {
          id: productCard.dataset.productId || 'no-id',
          name: titleElement.textContent.trim(),
          price: parseFloat(priceText) || 0,
          image: imageElement.src
        };
      } catch (error) {
        console.error('Error mendapatkan data produk:', error);
        return null;
      }
    }
  
    // Fungsi untuk menambahkan item ke cart
    async function addToCart(productCard) {
      const product = getProductData(productCard);
      if (!product) {
        alert('Gagal mendapatkan data produk');
        return;
      }
  
      try {
        // Simpan ke localStorage sebagai fallback
        addToLocalCart(product);
        
        // Coba simpan ke backend
        const response = await fetch(`/api/cart/${userId}/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: 1
          })
        });
  
        if (!response.ok) {
          throw new Error('Gagal menyimpan ke server');
        }
  
        showPopup();
      } catch (error) {
        console.error('Error:', error);
        // Tetap tampilkan popup meskipun backend error
        showPopup();
      }
    }
  
    // Fungsi untuk menambahkan ke localStorage
    function addToLocalCart(product) {
      try {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const existingIndex = cartItems.findIndex(item => item.id === product.id);
        
        if (existingIndex >= 0) {
          cartItems[existingIndex].quantity = (cartItems[existingIndex].quantity || 1) + 1;
        } else {
          product.quantity = 1;
          cartItems.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error menyimpan ke localStorage:', error);
      }
    }
  
    // Event listener untuk tombol Add Item
    document.querySelectorAll('.button[id^="addItemBtn"]').forEach(button => {
      button.addEventListener('click', function() {
        const productCard = this.closest('.card');
        if (productCard) {
          addToCart(productCard);
        }
      });
    });
  
    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
  
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        const bars = this.querySelectorAll('.bar');
        if (bars.length === 3) {
          bars[0].style.transform = this.classList.contains('active') 
            ? 'translateY(8px) rotate(45deg)' : 'translateY(0) rotate(0)';
          bars[1].style.opacity = this.classList.contains('active') ? '0' : '1';
          bars[2].style.transform = this.classList.contains('active') 
            ? 'translateY(-8px) rotate(-45deg)' : 'translateY(0) rotate(0)';
        }
      });
    }
  
  
  });