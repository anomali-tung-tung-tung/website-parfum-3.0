document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');

    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Ambil nilai input
        const fullName = document.getElementById('full-name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const city = document.getElementById('city').value;
        const cardNumber = document.getElementById('card-number').value;
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

        if (cartItems.length === 0) {
            alert("Keranjang belanja Anda kosong!");
            return;
        }

        // Simpan data pesanan (simulasi checkout)
        const orderDetails = {
            fullName,
            email,
            address,
            city,
            cardNumber,
            items: cartItems
        };

        console.log("Pesanan berhasil diproses:", orderDetails);

        // Kosongkan keranjang setelah checkout
        localStorage.removeItem('cart');
        alert("Pesanan Anda telah diterima! Terima kasih telah berbelanja.");
        window.location.reload(); // Refresh halaman setelah checkout
    });
});
