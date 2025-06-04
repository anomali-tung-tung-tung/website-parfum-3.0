document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkout-form');

    checkoutForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        if (cartItems.length === 0) {
            alert("Keranjang belanja Anda kosong!");
            return;
        }
        
        // Get form values
        const formData = new FormData(checkoutForm);
        const orderData = {
            billing: {
                name: formData.get('firstname'),
                email: formData.get('email'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zip: formData.get('zip')
            },
            payment: {
                cardName: formData.get('cardname'),
                cardNumber: formData.get('cardnumber'),
                expMonth: formData.get('expmonth'),
                expYear: formData.get('expyear'),
                cvv: formData.get('cvv')
            },
            items: cartItems,
            shippingSameAsBilling: formData.get('sameadr') === 'on'
        };

        console.log("Order Data:", orderData);
        localStorage.removeItem('cart'); // Clear cart after checkout
        alert("Pesanan Anda telah diproses! Terima kasih telah berbelanja.");
        closeModal(); // Close the modal after checkout
        window.location.reload(); // Refresh the page after checkout
        

        console.log("Pesanan berhasil diproses:", orderDetails);

        // Kosongkan keranjang setelah checkout
        localStorage.removeItem('cart');
        alert("Pesanan Anda telah diproses! Terima kasih telah berbelanja.");

        window.addEventListener('click', function (event) {
            const modal = document.getElementById('checkout-modal');
            if (event.target === modal) {
              closeModal();
            }
          });
    });
    
});
