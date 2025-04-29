document.addEventListener("DOMContentLoaded", function() {
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

    // 2. **Tombol Dark Mode**
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        // Periksa apakah dark mode aktif sebelumnya
        if (localStorage.getItem("dark-mode") === "enabled") {
            document.body.classList.add("dark-mode");
            themeToggle.textContent = "☀️"; // Mode Terang
        }

        themeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");

            if (document.body.classList.contains("dark-mode")) {
                localStorage.setItem("dark-mode", "enabled");
                themeToggle.textContent = "☀️";
            } else {
                localStorage.setItem("dark-mode", "disabled");
                themeToggle.textContent = "🌙";
            }
        });
    }
});
