document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();
});

async function fetchCartItems() {
    try {
        const response = await fetch('/api/cart');
        const cartItems = await response.json();

        const tableBody = document.querySelector('#cartTable tbody');
        tableBody.innerHTML = '';

        cartItems.forEach(item => {
            const tr = document.createElement('tr');

            const name = item.productId?.name || 'Produk Tidak Diketahui';
            const quantity = item.quantity;
            const timestamp = new Date(item.timestamp).toLocaleString();

            tr.innerHTML = `
                <td>${name}</td>
                <td>${quantity}</td>
                <td>${timestamp}</td>
                <td><button class="delete-btn" onclick="deleteCartItem('${item._id}')">Hapus</button></td>
            `;

            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Gagal memuat data cart:', error);
    }
}

async function deleteCartItem(id) {
    if (confirm('Yakin mau hapus item ini?')) {
        try {
            const res = await fetch(`/api/cart/${id}`, { method: 'DELETE' });
            const result = await res.json();
            console.log('Item dihapus:', result);
            fetchCartItems(); // Reload tabel
        } catch (error) {
            console.error('Gagal menghapus item:', error);
        }
    }
}
