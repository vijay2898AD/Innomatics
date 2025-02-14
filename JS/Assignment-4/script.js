const apiUrl = 'https://api.myjson.online/v1/records/f9c4ab39-ef45-41b5-adae-9365c739b557';
let products = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data && data.data && data.data.products) {
            products = data.data.products;
            displayProducts(products);
            updateCart();
        } else {
            console.error('Invalid API response:', data);
        }
    })
    .catch(error => console.error('Error fetching data:', error));

function displayProducts(productList) {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) {
        console.error("Product container missing in DOM.");
        return;
    }

    productContainer.innerHTML = ''; 

    if (productList.length === 0) {
        productContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    productList.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'product';

        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" style="width:150px; height:auto; margin-bottom:10px;"
                onerror="this.onerror=null; this.src='https://via.placeholder.com/150';">
            <h3>${product.name}</h3>
            <p><strong>Price:</strong> $${parseFloat(product.price).toFixed(2)}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            <p><strong>Description:</strong> ${product.description}</p>
            <button onclick="addToCart(${product.id}, ${product.price})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

function filterProducts(category) {
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase().includes(category.toLowerCase())
     );
     displayProducts(filteredProducts);
}

function showAllProducts() {
    displayProducts(products);
}

function addToCart(productId, price) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({ id: productId, name: product.name, price, quantity: 1 });
    }

    totalPrice += price;
    saveCart();
    updateCart();
}

function updateCart() {
    const cartElement = document.getElementById('cart');
    if (!cartElement) return;
    const wasCartOpen = cartElement.classList.contains('open')

    const itemCount = document.getElementById('item-count');
    const cartItems = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    itemCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalPriceElement.textContent = totalPrice.toFixed(2);

    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <p>${item.name} - $${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="changeQuantity(${item.id}, -1)">-</button>
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
            <button onclick="removeFromCart(${item.id})">x</button>
        `;

        cartItems.appendChild(cartItem);
    });

    saveCart();

    if (wasCartOpen) {
        setTimeout(() => { cartElement.classList.add('open'); }, 0);
    }

}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
}

function changeQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    let newQuantity = cartItem.quantity + change;

    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else {
        totalPrice += cartItem.price * change;
        cartItem.quantity = newQuantity;
        saveCart();
        updateCart();
    }
}

function removeFromCart(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;

    totalPrice -= cartItem.price * cartItem.quantity;
    cart = cart.filter(item => item.id !== productId);

    saveCart();
    updateCart();
}

function loadCart() {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    totalPrice = parseFloat(localStorage.getItem('totalPrice')) || 0;
    if (isNaN(totalPrice)) {
        totalPrice = 0;
    }
    updateCart();
}

function toggleCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.classList.toggle('open');
    }
}

const cartIcon = document.getElementById('cart-icon');
const cartElement = document.getElementById('cart');

if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        cartElement.classList.toggle('open');
    });
}

document.getElementById('empty-cart')?.addEventListener('click', () => {
    cart = [];
    totalPrice = 0;
    saveCart();
    updateCart();
});

document.addEventListener('click', (event) => {
    const cartElement = document.getElementById('cart');
    const cartIcon = document.getElementById('cart-icon');
    if (cartElement && cartIcon && !cartElement.contains(event.target) && !cartIcon.contains(event.target)) {
        cartElement.classList.remove('open');
    }
});

document.getElementById('cart-icon')?.addEventListener('click', toggleCart);

loadCart();