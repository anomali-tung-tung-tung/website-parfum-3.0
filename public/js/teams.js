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