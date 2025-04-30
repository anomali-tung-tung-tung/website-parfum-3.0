// Toggle dark mode
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Popup control
function openPopup() {
  document.getElementById('popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

// Fungsi untuk menambahkan item ke cart (POST ke server)
async function addToCart(productName, productPrice) {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: productName,
        price: productPrice,
        quantity: 1
      })
    });

    if (response.ok) {
      openPopup();
    } else {
      alert('Gagal menambahkan item ke keranjang!');
    }
  } catch (error) {
    console.error('Error menambahkan item:', error);
    alert('Terjadi kesalahan!');
  }
}

// Pasang event listener ke setiap tombol Add Item
document.getElementById('addItemBtn1').addEventListener('click', () => {
  addToCart('Pragos (50ml)', 200000);
});

document.getElementById('addItemBtn2').addEventListener('click', () => {
  addToCart('Santanos (50ml)', 500000);
});

document.getElementById('addItemBtn3').addEventListener('click', () => {
  addToCart('Alfatos (50ml)', 190000);
});

document.getElementById('addItemBtn4').addEventListener('click', () => {
  addToCart('Hibbos (50ml)', 90000);
});
