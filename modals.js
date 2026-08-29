// MY ORDERS, FAVORITES, AND SETTINGS MODALS
const ordersModal = document.getElementById('ordersModal');
const favoritesModal = document.getElementById('favoritesModal');
const settingsModal = document.getElementById('settingsModal');

const myOrdersLink = document.querySelector('.user-dropdown a[href="#orders"]');
const myFavoritesLink = document.querySelector('.user-dropdown a[href="#favorites"]');
const mySettingsLink = document.querySelector('.user-dropdown a[href="#settings"]');

const closeOrders = document.getElementById('closeOrders');
const closeFavorites = document.getElementById('closeFavorites');
const closeSettings = document.getElementById('closeSettings');

// Open modals
if (myOrdersLink) {
    myOrdersLink.addEventListener('click', (e) => {
        e.preventDefault();
        ordersModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        loadOrders();
    });
}

if (myFavoritesLink) {
    myFavoritesLink.addEventListener('click', (e) => {
        e.preventDefault();
        favoritesModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        loadFavorites();
    });
}

if (mySettingsLink) {
    mySettingsLink.addEventListener('click', (e) => {
        e.preventDefault();
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
        loadSettings();
    });
}

// Close modals
[closeOrders, closeFavorites, closeSettings].forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            ordersModal.classList.remove('show');
            favoritesModal.classList.remove('show');
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
});

// Close on overlay click
[ordersModal, favoritesModal, settingsModal].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
});

// Load Orders Function
function loadOrders() {
    const ordersContent = document.getElementById('ordersContent');
    const orders = JSON.parse(localStorage.getItem('foodBasketOrders')) || [];
    
    if (orders.length === 0) {
        ordersContent.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-receipt"></i>
                <p>No orders yet!</p>
                <small>Your order history will appear here</small>
            </div>
        `;
        return;
    }
    
    ordersContent.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <span class="order-status ${order.status}">${order.status.toUpperCase()}</span>
            </div>
            <div class="order-items-list">
                ${order.items.map(item => `
                    <div class="order-product">
                        <img src="Products_Images/${item.image}" alt="${item.name}">
                        <div class="order-product-info">
                            <h4>${item.name}</h4>
                            <small>Qty: ${item.qty} × ${item.price}</small>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                <span>Total:</span>
                <span>${order.total}</span>
            </div>
        </div>
    `).join('');
}

// Load Favorites Function
function loadFavorites() {
    const favoritesContent = document.getElementById('favoritesContent');
    const favorites = JSON.parse(localStorage.getItem('foodBasketFavorites')) || [];
    
    if (favorites.length === 0) {
        favoritesContent.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-heart"></i>
                <p>No favorites yet!</p>
                <small>Start adding your favorite items</small>
            </div>
        `;
        return;
    }
    
    const favoriteProducts = productList.filter(p => favorites.includes(p.id));
    
    favoritesContent.innerHTML = `
        <div class="favorites-grid">
            ${favoriteProducts.map(product => `
                <div class="favorite-card">
                    <button class="remove-favorite" data-id="${product.id}">
                        <i class="fa-solid fa-times"></i>
                    </button>
                    <img src="Products_Images/${product.image}" alt="${product.name}">
                    <h4>${product.name}</h4>
                    <div class="price">${product.price}</div>
                    <button class="btn fav-add-btn" data-product='${JSON.stringify(product)}'>Add to Cart</button>
                </div>
            `).join('')}
        </div>
    `;
    
    // Add remove favorite listeners
    favoritesContent.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(btn.dataset.id);
            let favorites = JSON.parse(localStorage.getItem('foodBasketFavorites')) || [];
            favorites = favorites.filter(id => id !== productId);
            localStorage.setItem('foodBasketFavorites', JSON.stringify(favorites));
            loadFavorites();
        });
    });
    
    // Add to cart from favorites
    favoritesContent.querySelectorAll('.fav-add-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const product = JSON.parse(btn.dataset.product);
            addToCart(product);
        });
    });
}

// Load Settings Function
function loadSettings() {
    const userData = JSON.parse(localStorage.getItem('foodBasketUser')) || {};
    const settings = JSON.parse(localStorage.getItem('foodBasketSettings')) || {};
    
    // Populate user data
    if (userData.name) document.getElementById('settingsName').value = userData.name;
    if (userData.email) document.getElementById('settingsEmail').value = userData.email;
    
    // Populate saved settings
    if (settings.phone) document.getElementById('settingsPhone').value = settings.phone;
    if (settings.address1) document.getElementById('settingsAddress1').value = settings.address1;
    if (settings.address2) document.getElementById('settingsAddress2').value = settings.address2;
    if (settings.city) document.getElementById('settingsCity').value = settings.city;
    if (settings.pincode) document.getElementById('settingsPincode').value = settings.pincode;
    
    // Populate notification preferences
    if (settings.orderUpdates !== undefined) {
        document.getElementById('settingsOrderUpdates').checked = settings.orderUpdates;
    }
    if (settings.promotions !== undefined) {
        document.getElementById('settingsPromotions').checked = settings.promotions;
    }
    if (settings.whatsApp !== undefined) {
        document.getElementById('settingsWhatsApp').checked = settings.whatsApp;
    }
}

// Save Settings
const saveSettingsBtn = document.getElementById('saveSettings');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
        const settings = {
            phone: document.getElementById('settingsPhone').value,
            address1: document.getElementById('settingsAddress1').value,
            address2: document.getElementById('settingsAddress2').value,
            city: document.getElementById('settingsCity').value,
            pincode: document.getElementById('settingsPincode').value,
            orderUpdates: document.getElementById('settingsOrderUpdates').checked,
            promotions: document.getElementById('settingsPromotions').checked,
            whatsApp: document.getElementById('settingsWhatsApp').checked
        };
        
        localStorage.setItem('foodBasketSettings', JSON.stringify(settings));
        
        // Update user name if changed
        const newName = document.getElementById('settingsName').value;
        const newEmail = document.getElementById('settingsEmail').value;
        const userData = JSON.parse(localStorage.getItem('foodBasketUser')) || {};
        
        if (newName && newName !== userData.name) {
            userData.name = newName;
            const userNameSpan = document.getElementById('userName');
            if (userNameSpan) userNameSpan.textContent = newName;
        }
        if (newEmail && newEmail !== userData.email) {
            userData.email = newEmail;
        }
        
        localStorage.setItem('foodBasketUser', JSON.stringify(userData));
        
        alert('Settings saved successfully❗');
        settingsModal.classList.remove('show');
        document.body.style.overflow = '';
    });
}

// Function to save order when checkout is clicked
function saveOrder(items, total) {
    const orders = JSON.parse(localStorage.getItem('foodBasketOrders')) || [];
    const orderId = Date.now();
    const orderDate = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const newOrder = {
        id: orderId,
        date: orderDate,
        items: items,
        total: total,
        status: 'pending'
    };
    
    orders.unshift(newOrder); // Add to beginning
    localStorage.setItem('foodBasketOrders', JSON.stringify(orders));
}

// Update checkout button to save order
setTimeout(() => {
    const checkoutBtns = document.querySelectorAll('.btn-container .close-btn');
    if (checkoutBtns[1]) { // Second button is checkout
        checkoutBtns[1].addEventListener('click', (e) => {
            e.preventDefault();
            
            if (cartProduct.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            
            // Prepare order items
            const orderItems = [];
            cartState.forEach((state, productId) => {
                const product = cartProduct.find(p => p.id === productId);
                if (product) {
                    orderItems.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        qty: state.qty
                    });
                }
            });
            
            const cartTotalElement = document.querySelector('.cart-total');
            const total = cartTotalElement.textContent;
            saveOrder(orderItems, total);
            
            alert('Order placed successfully! Check My Orders for details.');
            
            // Clear cart
            cartProduct.length = 0;
            cartState.clear();
            const cartList = document.querySelector('.cart-list');
            cartList.innerHTML = '';
            
            // Update cart total and badge
            const cartValue = document.querySelector('.cart-value');
            cartTotalElement.textContent = '₹0.00';
            cartValue.textContent = 0;
            
            const cartTab = document.querySelector('.cart-tab');
            cartTab.classList.remove('active-cart-tab');
        });
    }
}, 1000);
