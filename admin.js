// ADMIN PANEL FUNCTIONALITY

// Admin Modal Elements
const adminModal = document.getElementById('adminModal');
const adminLink = document.getElementById('adminLink');
const closeAdmin = document.getElementById('closeAdmin');
const addProductForm = document.getElementById('addProductForm');
const productsTableBody = document.getElementById('productsTableBody');
const exportProductsBtn = document.getElementById('exportProducts');
const downloadTemplateBtn = document.getElementById('downloadTemplate');

// Initialize products in localStorage from Products.json if not already set
function initializeProducts() {
    const storedProducts = localStorage.getItem('foodBasketProducts');
    if (!storedProducts) {
        // First time - copy from productList (loaded from Products.json)
        localStorage.setItem('foodBasketProducts', JSON.stringify(productList));
    }
}

// Get products from localStorage
function getProducts() {
    const products = localStorage.getItem('foodBasketProducts');
    return products ? JSON.parse(products) : [];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem('foodBasketProducts', JSON.stringify(products));
    // Update the global productList and reload cards
    productList.length = 0;
    productList.push(...products);
    refreshProductCards();
}

// Refresh product cards on the main page
function refreshProductCards() {
    const cardList = document.querySelector('.card-list');
    cardList.innerHTML = '';
    showCards(); // Call the existing showCards function
}

// Admin Auth Gate
const ADMIN_PASSWORD = 'Manveer@1313';
const adminPasswordModal = document.getElementById('adminPasswordModal');
const adminPasswordInput = document.getElementById('adminPasswordInput');
const adminPassSubmit = document.getElementById('adminPassSubmit');
const adminPassCancel = document.getElementById('adminPassCancel');
const adminPassError = document.getElementById('adminPassError');
const closeAdminPass = document.getElementById('closeAdminPass');
const toggleAdminPass = document.getElementById('toggleAdminPass');

function openAdminModal() {
    adminModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    loadProductsTable();
}

// Open Admin via link with password gate
if (adminLink) {
    adminLink.addEventListener('click', (e) => {
        e.preventDefault();
        const authed = sessionStorage.getItem('foodBasketAdminAuthed') === 'true';
        if (authed) {
            openAdminModal();
        } else {
            adminPasswordModal.classList.add('show');
            adminPassError.style.display = 'none';
            adminPasswordInput.value = '';
            adminPasswordInput.focus();
        }
    });
}

// Admin password modal handlers
function closeAdminPassModal() {
    adminPasswordModal.classList.remove('show');
    document.body.style.overflow = '';
}

if (adminPassCancel) {
    adminPassCancel.addEventListener('click', () => {
        closeAdminPassModal();
    });
}

if (closeAdminPass) {
    closeAdminPass.addEventListener('click', () => {
        closeAdminPassModal();
    });
}

if (toggleAdminPass) {
    toggleAdminPass.addEventListener('click', (e) => {
        e.preventDefault();
        const icon = toggleAdminPass.querySelector('i');
        if (adminPasswordInput.type === 'password') {
            adminPasswordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            adminPasswordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

function validateAdminPassword() {
    const value = adminPasswordInput.value;
    if (value === ADMIN_PASSWORD) {
        sessionStorage.setItem('foodBasketAdminAuthed', 'true');
        closeAdminPassModal();
        openAdminModal();
    } else {
        adminPassError.style.display = 'block';
    }
}

if (adminPassSubmit) {
    adminPassSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        validateAdminPassword();
    });
}

if (adminPasswordInput) {
    adminPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            validateAdminPassword();
        }
    });
}

// Close Admin Modal
if (closeAdmin) {
    closeAdmin.addEventListener('click', () => {
        adminModal.classList.remove('show');
        document.body.style.overflow = '';
    });
}

// Close on overlay click
if (adminModal) {
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            adminModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// Load Products Table
function loadProductsTable() {
    const products = getProducts();
    
    if (products.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem;">
                    <i class="fa-solid fa-box-open" style="font-size: 4rem; color: #ccc;"></i>
                    <p style="margin-top: 1rem; color: #999;">No products available</p>
                </td>
            </tr>
        `;
        return;
    }
    
    productsTableBody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="Products_Images/${product.image}" alt="${product.name}" onerror="this.src='Products_Images/placeholder.png'"></td>
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteProduct(${product.id})">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

// Add Product Form Submit
if (addProductForm) {
    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('productName').value.trim();
        const price = document.getElementById('productPrice').value.trim();
        const image = document.getElementById('productImage').value.trim();
        
        if (!name || !price || !image) {
            alert('Please fill all required fields!');
            return;
        }
        
        const products = getProducts();
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            name: name,
            price: `₹${price}`,
            image: image
        };
        
        products.push(newProduct);
        saveProducts(products);
        loadProductsTable();
        addProductForm.reset();
        
        alert(`✅ Product "${name}" added successfully!`);
    });
}

// Edit Product Function
window.editProduct = function(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    const newName = prompt('Enter new name:', product.name);
    if (newName === null) return; // User cancelled
    
    const priceWithoutSymbol = product.price.replace('₹', '');
    const newPrice = prompt('Enter new price (without ₹):', priceWithoutSymbol);
    if (newPrice === null) return; // User cancelled
    
    const newImage = prompt('Enter new image filename:', product.image);
    if (newImage === null) return; // User cancelled
    
    // Update product
    product.name = newName.trim();
    product.price = `₹${newPrice.trim()}`;
    product.image = newImage.trim();
    
    saveProducts(products);
    loadProductsTable();
    
    alert(`✅ Product updated successfully!`);
};

// Delete Product Function
window.deleteProduct = function(productId) {
    const products = getProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`);
    if (!confirmed) return;
    
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
    loadProductsTable();
    
    alert(`✅ Product "${product.name}" deleted successfully!`);
};

// Export Products to JSON
if (exportProductsBtn) {
    exportProductsBtn.addEventListener('click', () => {
        const products = getProducts();
        const dataStr = JSON.stringify(products, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `Products_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('✅ Products exported successfully!');
    });
}

// Download Template
if (downloadTemplateBtn) {
    downloadTemplateBtn.addEventListener('click', () => {
        const template = [
            {
                "id": 1,
                "name": "Product Name",
                "price": "₹299",
                "image": "product.png"
            }
        ];
        
        const dataStr = JSON.stringify(template, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Product_Template.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('✅ Template downloaded! Use this format to add products.');
    });
}

// Initialize products on page load
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for productList to be loaded from Products.json
    setTimeout(() => {
        initializeProducts();
    }, 500);
});
