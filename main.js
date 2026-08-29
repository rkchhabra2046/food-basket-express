/* global emailjs */

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', () => {
    checkUserSession();
});

var swiper = new Swiper(".mySwiper", {
    loop: true,
    navigation: {
        nextEl: "#nextbtn",
        prevEl: "#prevbtn",
    },
});

const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartValue = document.querySelector(".cart-value");
const cartTotalElement = document.querySelector(".cart-total");

cartIcon.addEventListener("click", () => cartTab.classList.add("cart-tab-active"));
closeBtn.addEventListener("click", () => cartTab.classList.remove("cart-tab-active"));

let productList = [];
let cartProduct = [];
// Track per-item quantity and DOM refs by product id
const cartState = new Map();

const showCards = () => {
    //console.log(productList);// For testing purpose
    const favorites = JSON.parse(localStorage.getItem('foodBasketFavorites')) || [];
    
    productList.forEach((product) => {

        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");
        
        const isFavorite = favorites.includes(product.id);

        orderCard.innerHTML = `<div class="card-image">
                        <img src="Products_Images/${product.image}">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${product.id}">
                            <i class="fa-${isFavorite ? 'solid' : 'regular'} fa-heart"></i>
                        </button>
                        </div>
                        <h4>${product.name}</h4>
                        <h4 class="price">${product.price}</h4>
                        <a href="#" class="btn card-btn">Add to Cart</a>`;

        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector(".card-btn");
        cardBtn.addEventListener("click", (e) => {
            e.preventDefault();

            //alert(`${product.name} added to your cart!`);// For testing purpose
            addToCart(product);
        });
        
        // Favorite button handler
        const favBtn = orderCard.querySelector(".favorite-btn");
        favBtn.addEventListener("click", (e) => {
            e.preventDefault();
            toggleFavorite(product.id, favBtn);
        });
    })
}

const addToCart = (product) => {
    const unitPrice = parseFloat(product.price.replace('₹', ''));
    const existing = cartState.get(product.id);
    if (existing) {
        // increment existing quantity and update UI
        existing.qty += 1;
        existing.qtyEl.textContent = existing.qty;
        existing.totalEl.textContent = `₹${(unitPrice * existing.qty).toFixed(2)}`;
        updateCartTotal();
        return;
    }

    // Add new item entry
    cartProduct.push(product);
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    cartItem.dataset.id = product.id;
    cartItem.innerHTML = `
        <div class="item-image">
            <img src="Products_Images/${product.image}">
        </div>
        <div class="detail">
            <h4>${product.name}</h4>
            <h4 class="item-total">₹${unitPrice.toFixed(2)}</h4>
        </div>
        <div class="flex">
            <a href="#" class="quantity-btn minus">
                <i class="fa-solid fa-minus"></i>
            </a>
            <h4 class="quantity-value">1</h4>
            <a href="#" class="quantity-btn plus">
                <i class="fa-solid fa-plus"></i>
            </a>
        </div>`;
    cartList.appendChild(cartItem);

    const plusBtn = cartItem.querySelector(".plus");
    const minusBtn = cartItem.querySelector(".minus");
    const qtyEl = cartItem.querySelector(".quantity-value");
    const totalEl = cartItem.querySelector(".item-total");

    // Save state
    cartState.set(product.id, { qty: 1, unitPrice, qtyEl, totalEl, node: cartItem });

    plusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const state = cartState.get(product.id);
        state.qty += 1;
        state.qtyEl.textContent = state.qty;
        state.totalEl.textContent = `₹${(state.unitPrice * state.qty).toFixed(2)}`;
        updateCartTotal();
    });

    minusBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const state = cartState.get(product.id);
        if (state.qty > 1) {
            state.qty -= 1;
            state.qtyEl.textContent = state.qty;
            state.totalEl.textContent = `₹${(state.unitPrice * state.qty).toFixed(2)}`;
        } else {
            // Remove entry
            cartState.delete(product.id);
            const index = cartProduct.findIndex(p => p.id === product.id);
            if (index > -1) cartProduct.splice(index, 1);
            cartItem.remove();
        }
        updateCartTotal();
    });

    updateCartTotal();
}

const updateCartTotal = () => {
    let total = 0;
    let qtySum = 0;
    cartState.forEach((state) => {
        total += state.unitPrice * state.qty;
        qtySum += state.qty;
    });
    cartTotalElement.textContent = `₹${total.toFixed(2)}`;
    cartValue.textContent = qtySum; // show total quantity in badge
}

// FAVORITE FUNCTIONALITY
function toggleFavorite(productId, btnElement) {
    let favorites = JSON.parse(localStorage.getItem('foodBasketFavorites')) || [];
    const icon = btnElement.querySelector('i');
    
    if (favorites.includes(productId)) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== productId);
        btnElement.classList.remove('active');
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
    } else {
        // Add to favorites
        favorites.push(productId);
        btnElement.classList.add('active');
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
    }
    
    localStorage.setItem('foodBasketFavorites', JSON.stringify(favorites));
}

const initapp = () => {
    fetch("products.json")
        .then((response) => response.json())
        .then((data) => {
            // Check if products exist in localStorage
            const storedProducts = localStorage.getItem('foodBasketProducts');
            if (storedProducts) {
                // Use products from localStorage (admin may have modified them)
                productList = JSON.parse(storedProducts);
            } else {
                // First load - use products from JSON file
                productList = data;
                localStorage.setItem('foodBasketProducts', JSON.stringify(data));
            }
            showCards();
        })
        .catch((error) => {
            console.error('Error loading products:', error);
            // Fallback to localStorage if fetch fails
            const storedProducts = localStorage.getItem('foodBasketProducts');
            if (storedProducts) {
                productList = JSON.parse(storedProducts);
                showCards();
            }
        });
}

initapp();

// AUTH MODAL LOGIC
const authModal = document.getElementById('authModal');
const authClose = document.getElementById('authClose');
const authOverlay = authModal.querySelector('.auth-overlay');
const signInBtn = document.getElementById('signInBtn');
const signInBtnMobile = document.getElementById('signInBtnMobile');
const authTabs = document.querySelectorAll('.auth-tab');
const authViews = document.querySelectorAll('.auth-view');
const togglePasswordBtns = document.querySelectorAll('.toggle-password');
const signupPasswordInput = document.querySelector('#signupForm input[name="password"]');
const passwordStrength = document.querySelector('.password-strength');
const guestCheckout = document.getElementById('guestCheckout');
const guestCheckoutSignup = document.getElementById('guestCheckoutSignup');
const otpSignIn = document.getElementById('otpSignIn');

// Open modal
const openAuthModal = (e) => {
    e.preventDefault();
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
};

signInBtn.addEventListener('click', openAuthModal);
signInBtnMobile.addEventListener('click', openAuthModal);

// Close modal
const closeAuthModal = () => {
    authModal.classList.remove('active');
    document.body.style.overflow = '';
};

authClose.addEventListener('click', closeAuthModal);
authOverlay.addEventListener('click', closeAuthModal);

// ESC key to close
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        closeAuthModal();
    }
});

// Tab switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        
        // Update active tab
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding view
        authViews.forEach(view => {
            view.classList.remove('active');
            if (view.id === `${targetTab}View`) {
                view.classList.add('active');
            }
        });
    });
});

// Toggle password visibility
togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const input = btn.previousElementSibling;
        const icon = btn.querySelector('i');
        
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
});

// Password strength checker
if (signupPasswordInput && passwordStrength) {
    signupPasswordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        let strength = '';
        let className = '';
        
        if (password.length === 0) {
            strength = '';
        } else if (password.length < 6) {
            strength = 'Weak password';
            className = 'weak';
        } else if (password.length < 10) {
            strength = 'Medium strength';
            className = 'medium';
        } else if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            strength = 'Strong password!';
            className = 'strong';
        } else {
            strength = 'Medium strength';
            className = 'medium';
        }
        
        passwordStrength.textContent = strength;
        passwordStrength.className = `password-strength ${className}`;
    });
}

// Email validation
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Form validation on submit
document.getElementById('signinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const emailPhone = e.target.emailPhone.value;
    const password = e.target.password.value;
    
    // Basic validation
    if (!emailPhone || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Extract name from email (everything before @)
    const name = emailPhone.includes('@') 
        ? emailPhone.split('@')[0] 
        : emailPhone.split(' ')[0];
    
    // Save user session and show welcome popup
    saveUserSession(name.charAt(0).toUpperCase() + name.slice(1), emailPhone);
    showWelcomePopup(name.charAt(0).toUpperCase() + name.slice(1));
    closeAuthModal();
});

document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    if (!name) {
        alert('Please enter your name');
        return;
    }
    
    if (!validateEmail(email)) {
        e.target.email.classList.add('invalid');
        alert('Please enter a valid email address');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    // Save user session and show welcome popup
    saveUserSession(name, email);
    showWelcomePopup(name);
    closeAuthModal();
});

// Guest checkout
guestCheckout.addEventListener('click', () => {
    alert('Continuing as guest... (This is a demo)');
    closeAuthModal();
});

guestCheckoutSignup.addEventListener('click', () => {
    alert('Continuing as guest... (This is a demo)');
    closeAuthModal();
});

// OTP sign in
otpSignIn.addEventListener('click', () => {
    alert('OTP sent to your phone! (This is a demo)');
});

// EMAILJS CONTACT FORM HANDLER
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.textContent = '';
        formStatus.className = 'form-status';
        
        // Send email via EmailJS
        // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs from EmailJS dashboard
        emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', contactForm)
            .then(() => {
                // Success
                formStatus.textContent = '✓ Message sent successfully! We\'ll reply within 45 minutes.';
                formStatus.className = 'form-status success';
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            })
            .catch((error) => {
                // Error
                console.error('EmailJS error:', error);
                formStatus.textContent = '✗ Failed to send. Please try again or email us directly.';
                formStatus.className = 'form-status error';
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });
}

// USER SESSION MANAGEMENT
// signInBtn, userMenu already declared above
const userNameSpan = document.getElementById('userName');
const welcomePopup = document.getElementById('welcomePopup');
const welcomeMessage = document.getElementById('welcomeMessage');
const logoutBtn = document.getElementById('logoutBtn');

function checkUserSession() {
    const user = localStorage.getItem('foodBasketUser');
    if (user) {
        const userData = JSON.parse(user);
        showUserMenu(userData.name);
    }
}

function showUserMenu(name) {
    signInBtn.style.display = 'none';
    userMenu.style.display = 'block';
    userNameSpan.textContent = name;
}

function showWelcomePopup(name) {
    welcomeMessage.textContent = `Hello, ${name}!`;
    welcomePopup.classList.add('show');
    
    setTimeout(() => {
        welcomePopup.classList.remove('show');
    }, 6000); // 6 seconds display time
}

function saveUserSession(name, email) {
    const userData = { name, email };
    localStorage.setItem('foodBasketUser', JSON.stringify(userData));
    showUserMenu(name);
    showWelcomePopup(name);
}

function clearUserSession() {
    localStorage.removeItem('foodBasketUser');
    // Also clear admin auth for this session
    try { sessionStorage.removeItem('foodBasketAdminAuthed'); } catch (e) {}
    userMenu.style.display = 'none';
    signInBtn.style.display = 'inline-block';
}

// Logout handler
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        clearUserSession();
        alert('You have been logged out successfully!');
    });
}

// TERMS & CONDITIONS MODAL
const termsModal = document.getElementById('termsModal');
const termsLink = document.getElementById('termsLink');
const termsClose = document.getElementById('termsClose');
const termsOverlay = termsModal.querySelector('.terms-overlay');
const acceptTerms = document.getElementById('acceptTerms');
const termsCheckbox = document.querySelector('input[name="terms"]');

if (termsLink) {
    termsLink.addEventListener('click', (e) => {
        e.preventDefault();
        termsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

if (termsClose) {
    termsClose.addEventListener('click', () => {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (termsOverlay) {
    termsOverlay.addEventListener('click', () => {
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}

if (acceptTerms) {
    acceptTerms.addEventListener('click', () => {
        if (termsCheckbox) {
            termsCheckbox.checked = true;
        }
        termsModal.classList.remove('active');
        document.body.style.overflow = '';
    });
}
// MY ORDERS, FAVORITES, AND SETTINGS MODALS - See additional code below
