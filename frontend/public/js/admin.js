const ordersSection = document.getElementById('ordersSection');
const productsSection = document.getElementById('productsSection');
const viewOrdersBtn = document.getElementById('viewOrdersBtn');
const manageProductsBtn = document.getElementById('manageProductsBtn');
const ordersTableBody = document.querySelector('#ordersTable tbody');
const productsTableBody = document.querySelector('#productsTable tbody');
const addProductForm = document.getElementById('addProductForm');

// Toggle Sections
viewOrdersBtn.addEventListener('click', () => {
  ordersSection.classList.remove('hidden');
  productsSection.classList.add('hidden');
  fetchOrders();
});

manageProductsBtn.addEventListener('click', () => {
  productsSection.classList.remove('hidden');
  ordersSection.classList.add('hidden');
  fetchProducts();
});

// Fetch Orders
async function fetchOrders() {
  ordersTableBody.innerHTML = 'Loading...';
  const res = await fetch('http://localhost:5000/api/orders');
  const orders = await res.json();
  ordersTableBody.innerHTML = '';
  orders.forEach(order => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.user}</td>
      <td>${order.items.map(i => `${i.product.name} x${i.quantity}`).join('<br>')}</td>
      <td>${order.total}</td>
      <td>${order.shippingAddress}</td>
      <td>${order.paymentStatus}</td>
      <td>${new Date(order.createdAt).toLocaleString()}</td>
    `;
    ordersTableBody.appendChild(row);
  });
}

// Fetch Products
async function fetchProducts() {
  productsTableBody.innerHTML = 'Loading...';
  const res = await fetch('http://localhost:5000/api/products');
  const products = await res.json();
  productsTableBody.innerHTML = '';
  products.forEach(product => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${product.name}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>
        <button class="btn btn-delete" onclick="deleteProduct('${product._id}')">Delete</button>
        <button class="btn btn-edit" data-id="${product._id}">Edit</button>
      </td>
    `;
    productsTableBody.appendChild(row);
  });

  // Add event listener untuk tombol Edit
  productsTableBody.querySelectorAll('.btn-edit').forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.getAttribute('data-id');
      const product = products.find(p => p._id === productId);
      editProductPrompt(product);
    });
  });
}

// Add Product
addProductForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addProductForm);
  const productData = {};
  formData.forEach((value, key) => {
    productData[key] = key === 'price' || key === 'stock' ? Number(value) : value;
  });

  const res = await fetch('http://localhost:5000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (res.ok) {
    alert('Product added!');
    addProductForm.reset();
    fetchProducts();
  } else {
    const error = await res.json();
    alert('Error: ' + error.error);
  }
});

// Delete Product
async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'DELETE',
  });
  if (res.ok) {
    alert('Product deleted!');
    fetchProducts();
  } else {
    const error = await res.json();
    alert('Error: ' + error.error);
  }
}

// Edit Product
function editProductPrompt(product) {
  const newName = prompt('Edit Name', product.name);
  const newDesc = prompt('Edit Description', product.description);
  const newPrice = prompt('Edit Price', product.price);
  const newStock = prompt('Edit Stock', product.stock);
  const newCategory = prompt('Edit Category', product.category);

  if (!newName || !newDesc || !newPrice || !newStock || !newCategory) {
    alert('All fields are required.');
    return;
  }

  const updatedProduct = {
    name: newName,
    description: newDesc,
    price: Number(newPrice),
    stock: Number(newStock),
    category: newCategory,
    imageUrl: product.imageUrl, // keep old image URL
  };

  updateProduct(product._id, updatedProduct);
}

// Update Product
async function updateProduct(id, updatedData) {
  const res = await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  if (res.ok) {
    alert('Product updated!');
    fetchProducts();
  } else {
    const error = await res.json();
    alert('Error: ' + error.error);
  }
}
