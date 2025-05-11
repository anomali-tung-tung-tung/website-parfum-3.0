document.addEventListener('DOMContentLoaded', function() {
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
    
    // Close menu when clicking on a link
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
    
    // Shop Now button functionality
    const shopNowBtn = document.querySelector('.shop-now-btn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', function() {
            window.location.href = "/public/html/products.html";  // Mengarahkan ke halaman product.html
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address');
            }
        });
    }
    
    // Email validation function
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Video autoplay functionality
    const video = document.querySelector("video");
    if (video) {
        video.muted = true;
        video.play().catch(error => console.log("Autoplay failed:", error));
    }

    // Collection card hover effects
    const collectionCards = document.querySelectorAll('.collection-card');
    const collectionBackground = document.querySelector('.collection-section-background');

    if (collectionCards.length && collectionBackground) {
        collectionCards.forEach(card => {
            card.addEventListener('mouseenter', function () {
                if (this.classList.contains('card-pragos')) {
                    collectionBackground.style.backgroundColor = '#e8f5e9';
                } else if (this.classList.contains('card-santanos')) {
                    collectionBackground.style.backgroundColor = '#efebe9';
                } else if (this.classList.contains('card-alfatos')) {
                    collectionBackground.style.backgroundColor = '#fce4ec';
                } else if (this.classList.contains('card-hibbos')) {
                    collectionBackground.style.backgroundColor = '#f3e5f5';
                } else if (this.classList.contains('card-labratos')) {
                    collectionBackground.style.backgroundColor = '#d7ccc8';
                } else if (this.classList.contains('card-arriopus')) {
                    collectionBackground.style.backgroundColor = '#fff3e0';
                } else if (this.classList.contains('card-walidous')) {
                    collectionBackground.style.backgroundColor = '#f1f8e9';
                } else if (this.classList.contains('card-dewwy')) {
                    collectionBackground.style.backgroundColor = '#e1f5fe';
                } else {
                    collectionBackground.style.backgroundColor = 'transparent'; // fallback
                }
            });

            card.addEventListener('mouseleave', function () {
                collectionBackground.style.backgroundColor = 'transparent';
            });
        });
    }

    // Auth Modal Functionality
    const userIcon = document.querySelector('.fa-user')?.parentElement;
    const authModal = document.getElementById('authModal');
    const closeModal = document.querySelector('.close-modal');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (userIcon && authModal) {
        userIcon.addEventListener('click', function(e) {
            e.preventDefault();
            authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', function() {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (tabButtons.length && loginForm && signupForm) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const tab = this.dataset.tab;
                if (tab === 'login') {
                    loginForm.style.display = 'block';
                    signupForm.style.display = 'none';
                } else {
                    loginForm.style.display = 'none';
                    signupForm.style.display = 'block';
                }
            });
        });
    }

    const authForms = document.querySelectorAll('.auth-form form');
    if (authForms.length) {
        authForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                console.log('Form submitted:', this);
                authModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                alert('Authentication successful! (This would be replaced with actual auth handling)');
            });
        });
    }
});
