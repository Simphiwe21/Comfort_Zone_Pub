// Authentication functionality
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('users')) || [];

// Initialize default demo user if none exists
if (users.length === 0) {
    const demoUser = {
        id: '1',
        fullname: 'Demo User',
        email: 'demo@comfortzonepub.com',
        password: 'password123',
        phone: '(+27) 12-345-6789',
        createdAt: '2025-09-01'
    };
    users.push(demoUser);
    localStorage.setItem('users', JSON.stringify(users));
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update auth links in ALL pages
function updateAuthLinks() {
    const authLinksContainers = document.querySelectorAll('.auth-links');
    
    authLinksContainers.forEach(container => {
        if (!container) return;
        
        if (currentUser) {
            const displayName = currentUser.fullname || currentUser.email.split('@')[0];
            const firstLetter = displayName.charAt(0).toUpperCase();
            
            container.innerHTML = `
                <div class="user-profile">
                    <div class="user-avatar">${firstLetter}</div>
                    <span class="user-name">${displayName}</span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            `;
        } else {
            container.innerHTML = `
                <a href="login.html">Login</a>
                <a href="signup.html">Sign Up</a>
            `;
        }
    });
    
    // Handle page-specific logic
    handlePageSpecificLogic();
}

// Handle page-specific authentication logic
function handlePageSpecificLogic() {
    const currentPage = window.location.pathname;
    
    // If user is logged in and on login/signup pages, redirect to home
    if (currentUser && (currentPage.includes('login.html') || currentPage.includes('signup.html'))) {
        setTimeout(() => {
            window.location.href = 'home.html';
        }, 1000);
        return;
    }
    
    // Handle reviews page specifically
    if (currentPage.includes('reviews.html')) {
        const addReviewSection = document.getElementById('add-review-section');
        const loginPrompt = document.getElementById('login-prompt');
        
        if (addReviewSection && loginPrompt) {
            if (currentUser) {
                addReviewSection.style.display = 'block';
                loginPrompt.style.display = 'none';
            } else {
                addReviewSection.style.display = 'none';
                loginPrompt.style.display = 'block';
            }
        }
    }
}

// Set redirect to reviews page
function setRedirectToReviews() {
    localStorage.setItem('redirectAfterLogin', 'reviews.html');
}

// Get redirect URL
function getRedirectUrl() {
    return localStorage.getItem('redirectAfterLogin');
}

// Clear redirect URL
function clearRedirectUrl() {
    localStorage.removeItem('redirectAfterLogin');
}

// Enhanced Sign up functionality
function setupSignupForm() {
    const signupForm = document.getElementById('signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const userData = {
                id: Date.now().toString(),
                fullname: formData.get('fullname'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                password: formData.get('password'),
                createdAt: new Date().toISOString()
            };
            
            // Check if passwords match
            const confirmPassword = formData.get('confirm-password');
            if (userData.password !== confirmPassword) {
                showNotification('Passwords do not match!');
                return;
            }
            
            // Check if user already exists
            const existingUser = users.find(user => user.email === userData.email);
            if (existingUser) {
                showNotification('User with this email already exists!');
                return;
            }
            
            // Validate password strength
            if (userData.password.length < 6) {
                showNotification('Password must be at least 6 characters long!');
                return;
            }
            
            // Add user to users array
            users.push(userData);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Auto-login the user
            currentUser = userData;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showNotification('Account created successfully! Welcome to Comfort Zone Pub!');
            
            // Update auth links immediately
            updateAuthLinks();
            
            // Redirect based on redirect URL or to home
            setTimeout(() => {
                const redirectTo = getRedirectUrl() || 'home.html';
                clearRedirectUrl();
                window.location.href = redirectTo;
            }, 1500);
        });
    }
}

// Enhanced Login functionality
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const password = formData.get('password');
            
            // Find user
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showNotification(`Welcome back, ${user.fullname || user.email.split('@')[0]}!`);
                
                // Update auth links immediately
                updateAuthLinks();
                
                // Redirect based on redirect URL or to home
                setTimeout(() => {
                    const redirectTo = getRedirectUrl() || 'home.html';
                    clearRedirectUrl();
                    window.location.href = redirectTo;
                }, 1500);
            } else {
                showNotification('Invalid email or password!');
            }
        });
    }
}

// Enhanced Logout functionality
function logout() {
    // Clear any redirect URLs
    clearRedirectUrl();
    
    currentUser = null;
    localStorage.removeItem('currentUser');
    
    showNotification('Logged out successfully!');
    
    // Update auth links immediately
    updateAuthLinks();
    
    // Redirect to home page after 1 second
    setTimeout(() => {
        window.location.href = 'home.html';
    }, 1000);
}

// Enhanced Reviews functionality
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    {
        id: '1',
        userId: '1',
        userName: 'Philani Nyembe',
        rating: 5,
        title: 'Best steak in town!',
        comment: 'The ribeye steak was cooked to perfection. The atmosphere was cozy and the service was exceptional. Will definitely be coming back!',
        date: '2025-10-15'
    },
    {
        id: '2',
        userId: '2',
        userName: 'Junior Madlopha',
        rating: 4,
        title: 'Great food and live music',
        comment: 'We visited on a Friday night and the live band was amazing! The burgers are delicious and the craft beer selection is impressive.',
        date: '2025-10-10'
    }
];

// Setup reviews page
function setupReviewsPage() {
    // Set redirect URL for after login if user is not logged in
    if (!currentUser) {
        setRedirectToReviews();
    }
    
    // Setup review form if user is logged in
    if (currentUser) {
        setupReviewForm();
    }
    
    displayReviews();
}

// Enhanced review form setup
function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('review-rating');
    
    if (reviewForm && currentUser) {
        // Initialize star rating
        let currentRating = 0;
        
        // Star rating functionality
        stars.forEach(star => {
            star.addEventListener('click', function() {
                currentRating = parseInt(this.getAttribute('data-rating'));
                ratingInput.value = currentRating;
                
                // Update star display
                stars.forEach(s => {
                    const starRating = parseInt(s.getAttribute('data-rating'));
                    if (starRating <= currentRating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
        });
        
        // Form submission
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!currentUser) {
                showNotification('Please login to submit a review');
                setRedirectToReviews();
                window.location.href = 'login.html';
                return;
            }
            
            const formData = new FormData(this);
            const rating = parseFloat(formData.get('rating'));
            const title = formData.get('title').trim();
            const comment = formData.get('comment').trim();
            
            // Validation
            if (!rating || rating === 0) {
                showNotification('Please select a rating');
                return;
            }
            
            const review = {
                id: Date.now().toString(),
                userId: currentUser.id,
                userName: currentUser.fullname,
                rating: rating,
                title: title,
                comment: comment,
                date: new Date().toISOString().split('T')[0]
            };
            
            // Add review to beginning of array
            reviews.unshift(review);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            
            // Reset form
            this.reset();
            stars.forEach(star => star.classList.remove('active'));
            ratingInput.value = '';
            currentRating = 0;
            
            // Update reviews display
            displayReviews();
            
            showNotification('Thank you for your review!');
        });
    }
}

// Display reviews
function displayReviews() {
    const reviewsList = document.querySelector('.reviews-list');
    
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="empty-reviews">
                <h3>No reviews yet</h3>
                <p>Be the first to share your experience at Comfort Zone Pub!</p>
                ${currentUser ? 
                    '<p>Write a review using the form above.</p>' : 
                    '<a href="signup.html" class="btn">Create Account to Review</a>'
                }
            </div>
        `;
        return;
    }
    
    let reviewsHTML = '';
    
    reviews.forEach(review => {
        const fullStars = '★'.repeat(Math.floor(review.rating));
        const hasHalfStar = review.rating % 1 !== 0;
        const emptyStars = '☆'.repeat(5 - Math.ceil(review.rating));
        
        const starRating = fullStars + (hasHalfStar ? '½' : '') + emptyStars;
        
        // Check if this review is from current user
        const isCurrentUserReview = currentUser && review.userId === currentUser.id;
        
        reviewsHTML += `
            <div class="review-item ${isCurrentUserReview ? 'current-user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <h4>${review.userName} 
                            ${isCurrentUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
                        </h4>
                        <div class="review-rating">
                            ${starRating} <span class="rating-text">${review.rating.toFixed(1)}</span>
                        </div>
                    </div>
                    <div class="review-date">${formatDate(review.date)}</div>
                </div>
                <h5 class="review-title">${review.title}</h5>
                <p class="review-comment">${review.comment}</p>
            </div>
        `;
    });
    
    reviewsList.innerHTML = reviewsHTML;
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Cart functionality
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Add to cart functionality
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            addToCart(id, name, price);
            showNotification(`${name} added to cart!`);
        });
    });
}

// Add item to cart
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // If we're on the order page, update the cart display
    if (window.location.pathname.includes('order.html')) {
        displayCartItems();
    }
}

// Display cart items on order page
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItemsList) return;
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p class="empty-cart">Your cart is empty. <a href="menu.html">Browse our menu</a> to add items.</p>';
        if (cartTotal) cartTotal.textContent = '0.00';
        return;
    }
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>R${item.price.toFixed(2)} each</p>
                    <div class="item-quantity">
                        <button class="quantity-btn decrease">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn increase">+</button>
                    </div>
                </div>
                <div class="item-actions">
                    <div class="item-total">R${itemTotal.toFixed(2)}</div>
                    <button class="remove-item">Remove</button>
                </div>
            </div>
        `;
    });
    
    cartItemsList.innerHTML = itemsHTML;
    if (cartTotal) cartTotal.textContent = total.toFixed(2);
    
    // Add event listeners to quantity buttons and remove buttons
    setupCartItemEvents();
}

// Setup events for cart items (quantity changes and removal)
function setupCartItemEvents() {
    // Quantity decrease buttons
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const id = cartItem.getAttribute('data-id');
            const input = cartItem.querySelector('.quantity-input');
            let quantity = parseInt(input.value);
            
            if (quantity > 1) {
                quantity--;
                input.value = quantity;
                updateCartItemQuantity(id, quantity);
            }
        });
    });
    
    // Quantity increase buttons
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const id = cartItem.getAttribute('data-id');
            const input = cartItem.querySelector('.quantity-input');
            let quantity = parseInt(input.value);
            
            quantity++;
            input.value = quantity;
            updateCartItemQuantity(id, quantity);
        });
    });
    
    // Quantity input changes
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const cartItem = this.closest('.cart-item');
            const id = cartItem.getAttribute('data-id');
            let quantity = parseInt(this.value);
            
            if (quantity < 1) {
                quantity = 1;
                this.value = 1;
            }
            
            updateCartItemQuantity(id, quantity);
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            const id = cartItem.getAttribute('data-id');
            removeFromCart(id);
        });
    });
}

// Update cart item quantity
function updateCartItemQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
    }
}

// Remove item from cart
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCartItems();
    showNotification('Item removed from cart');
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    if (notification && notificationText) {
        notificationText.textContent = message;
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }
}

// Hamburger menu functionality
function setupHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Checkout form submission
function setupCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before placing an order.');
                return;
            }
            
            // In a real application, you would send this data to a server
            const formData = new FormData(this);
            const orderData = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                instructions: formData.get('instructions'),
                items: cart,
                total: cart.reduce((total, item) => total + (item.price * item.quantity), 0)
            };
            
            console.log('Order placed:', orderData);
            
            // Show success message
            alert('Thank you for your order! We will contact you shortly to confirm.');
            
            // Clear cart
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
            
            // Reset form
            this.reset();
        });
    }
}


// Enhanced initialization function
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateAuthLinks();
    setupAddToCartButtons();
    setupHamburgerMenu();
    setupCheckoutForm();
    setupSignupForm();
    setupLoginForm();
    setupReviewsPage();
    
    if (window.location.pathname.includes('order.html')) {
        displayCartItems();
    }
    
    if (window.location.pathname.includes('visit.html')) {
        initMap();
    }
    
    // Clear redirect URL if we're on home page
    if (window.location.pathname.includes('home.html')) {
        clearRedirectUrl();
    }
});