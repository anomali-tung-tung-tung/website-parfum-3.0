document.addEventListener('DOMContentLoaded', function () {
    // Function to show popup
    function showPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000); // Popup hilang setelah 3 detik
        }
    }

    // Function to close popup
    function closePopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    // Event listeners for add item buttons
    const addItemButtons = document.querySelectorAll('.button[id^="addItemBtn"]');
    addItemButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.card');
            const product = {
                name: productCard.querySelector('.card__title').textContent,
                price: productCard.querySelector('.card__description').textContent.replace('Rp ', ''),
                image: productCard.querySelector('img').src,
            };
            addItemToCart(product); // Tambahkan produk ke keranjang
            showPopup(); // Tampilkan popup
        });
    });

    // Fungsi untuk menambahkan item ke keranjang (localStorage)
    function addItemToCart(product) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(product);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle hamburger animation
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

    // Dark mode functionality
    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        // Periksa apakah dark mode aktif sebelumnya
        if (localStorage.getItem('dark-mode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀'; // Mode Terang
        }

        themeToggle.addEventListener('click', function () {
            document.body.classList.toggle('dark-mode');

            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('dark-mode', 'enabled');
                themeToggle.textContent = '☀';
            } else {
                localStorage.setItem('dark-mode', 'disabled');
                themeToggle.textContent = '🌙';
            }
        });
    }
});
