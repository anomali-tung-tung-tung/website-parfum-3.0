document.addEventListener('DOMContentLoaded', function () {
    // Fungsi untuk menampilkan popup
    function showPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 2000); // otomatis hilang setelah 2 detik
        }
    }

    // Fungsi untuk menutup popup secara manual
    function closePopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    const closePopupBtn = document.getElementById('closePopupBtn');
    if (closePopupBtn) {
        closePopupBtn.addEventListener('click', closePopup);
    }

    // Buat atau ambil userId dari localStorage
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }

    // Ambil data produk dari elemen card
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
                .replace(',', '.') // jika harga pakai koma
                .trim();

            const productId = productCard.dataset.productId;
            if (!productId) {
                throw new Error('ID produk tidak ditemukan');
            }

            return {
                id: productId,
                name: titleElement.textContent.trim(),
                price: parseFloat(priceText) || 0,
                image: imageElement.src
            };
        } catch (error) {
            console.error('Error mendapatkan data produk:', error);
            return null;
        }
    }

    // Menyimpan item ke localStorage
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

    // Tambahkan item ke cart lokal
    function addToCart(productCard) {
        const product = getProductData(productCard);
        if (!product) {
            alert('Gagal mendapatkan data produk');
            return;
        }

        try {
            // Simpan lokal dulu
            addToLocalCart(product);
            showPopup();
        } catch (error) {
            console.error('Error:', error);
            showPopup(); // tetap tampilkan popup meski gagal
        }
    }

    // Event listener tombol add to cart
    document.querySelectorAll('.button.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
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
        hamburger.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');

            const bars = this.querySelectorAll('.bar');
            if (bars.length === 3) {
                const isActive = this.classList.contains('active');
                bars[0].style.transform = isActive ? 'translateY(8px) rotate(45deg)' : 'translateY(0) rotate(0)';
                bars[1].style.opacity = isActive ? '0' : '1';
                bars[2].style.transform = isActive ? 'translateY(-8px) rotate(-45deg)' : 'translateY(0) rotate(0)';
            }
        });
    }
});
