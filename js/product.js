document.addEventListener('DOMContentLoaded', function () {
    function showPopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.style.display = 'none';
            }, 3000);
        }
    }

    function closePopup() {
        const popup = document.getElementById('popup');
        if (popup) {
            popup.style.display = 'none';
        }
    }

    const addItemButtons = document.querySelectorAll('.button[id^="addItemBtn"]');
    addItemButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const productCard = button.closest('.card');
            const product = {
                name: productCard.querySelector('.card__title').textContent.trim(),
                price: productCard.querySelector('.card__description').textContent.replace('Rp ', '').trim(),
                image: productCard.querySelector('img').src,
            };

            addItemToCart(product);
            await saveToDatabase(product);
            showPopup();
        });
    });

    function addItemToCart(product) {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        cartItems.push(product);
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }

    async function saveToDatabase(product) {
        try {
            const response = await fetch('/api/products');
            const allProducts = await response.json();

            console.log('Produk dari database:', allProducts);

            const matchedProduct = allProducts.find(p => p.name.trim().toLowerCase() === product.name.toLowerCase());

            if (matchedProduct) {
                const res = await fetch('/api/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        productId: matchedProduct._id,
                        quantity: 1
                    })
                });

                const result = await res.json();
                console.log('Hasil simpan ke cart:', result);
            } else {
                console.warn('❗ Produk tidak cocok ditemukan di database:', product.name);
            }
        } catch (error) {
            console.error('Gagal menyimpan ke database:', error);
        }
    }

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

    const themeToggle = document.getElementById('themeToggle');

    if (themeToggle) {
        if (localStorage.getItem('dark-mode') === 'enabled') {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀';
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
