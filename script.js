document.addEventListener('DOMContentLoaded', () => {
    // --- Data ---
    const products = [
        {
            id: 1,
            name: 'IGNITE V80',
            oldPrice: 120.00,
            price: 110.00,
            puffs: 8000,
            image: './images/ignite-v80.png',
            brand: 'ignite',
            tags: ['icy', 'bestseller', 'promotions'],
            flavors: ['Menta 🌿', 'Melancia Gelo 🍉❄️', 'Uva 🍇'],
            stock: 85,
            initialStock: 100
        },
        {
            id: 2,
            name: 'ELFBAR 45K',
            oldPrice: 180.00,
            price: 150.00,
            puffs: 45000,
            image: './images/elfbar-45k.png',
            brand: 'elfbar',
            tags: ['most-puffs', 'promotion', 'new'],
            flavors: ['Blue Razz 🫐', 'Morango Wiki 🥝🍓', 'Manga 🥭'],
            stock: 2,
            initialStock: 50
        },
        {
            id: 3,
            name: 'NIKBAR V400 MIX',
            oldPrice: 110.00,
            price: 95.00,
            puffs: 4000,
            image: './images/nikbar-v400.png',
            brand: 'nikbar',
            tags: ['icy', 'promotion'],
            flavors: ['Banana 🍌', 'Hortelã 🍃', 'Lichia 🍈'],
            stock: 45,
            initialStock: 100
        },
        {
            id: 4,
            name: 'IGNITE V50',
            oldPrice: 120.00,
            price: 100.00,
            puffs: 5000,
            image: './images/ignite-v80.png', // Reusing for demo
            brand: 'ignite',
            tags: ['icy'],
            flavors: ['Maçã Verde 🍏', 'Pêssego 🍑'],
            stock: 15,
            initialStock: 60
        },
        {
            id: 5,
            name: 'ELFBAR BC10000',
            oldPrice: 160.00,
            price: 140.00,
            puffs: 10000,
            image: './images/elfbar-45k.png', // Reusing for demo
            brand: 'elfbar',
            tags: ['most-puffs', 'new'],
            flavors: ['Cereja 🍒', 'Limão 🍋', 'Cola 🥤'],
            stock: 5,
            initialStock: 20
        },
        {
            id: 6,
            name: 'NIKBAR FREEZE',
            oldPrice: 100.00,
            price: 90.00,
            puffs: 2500,
            image: './images/nikbar-v400.png', // Reusing for demo
            brand: 'nikbar',
            tags: ['icy', 'promotions'],
            flavors: ['Abacaxi 🍍', 'Coco 🥥'],
            stock: 78,
            initialStock: 100
        }
    ];

    let cart = [];

    // --- DOM Elements ---
    const productContainer = document.getElementById('product-container');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cartBtn = document.querySelector('.cart-btn');
    const checkoutBtn = document.querySelector('.quick-checkout');

    // --- Render Products ---
    function renderProducts(filterType = 'all') {
        productContainer.innerHTML = '';

        let filteredProducts = [...products];

        if (filterType === 'most-puffs') {
            filteredProducts.sort((a, b) => b.puffs - a.puffs);
        } else if (filterType === 'icy') {
            filteredProducts = products.filter(p => p.tags.includes('icy'));
        } else if (filterType === 'promotions') {
            filteredProducts = products.filter(p => p.tags.includes('promotions') || p.tags.includes('promotion'));
        } else if (filterType === 'new') {
            filteredProducts = products.filter(p => p.tags.includes('new'));
        }

        filteredProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card', `brand-${product.brand}`);

            // Stock logic
            let stockPercent = (product.stock / product.initialStock) * 100;
            let stockClass = 'high';
            let stockText = `${product.stock} unidades restantes`;

            if (product.stock <= 5) {
                stockClass = 'low';
                stockText = `<span class="stock-alert">APENAS ${product.stock} RESTANTES!</span>`;
            } else if (product.stock < 20) {
                stockClass = 'medium';
            }

            // Flavor tags
            const flavorsHtml = product.flavors.map(f => `<span class="flavor-tag">${f}</span>`).join('');

            card.innerHTML = `
                <div class="puffs-badge">${product.puffs.toLocaleString()} Puffs</div>
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                </div>
                <h3 class="card-title">${product.name}</h3>
                
                <div class="flavor-list">
                    ${flavorsHtml}
                </div>

                <div class="price-container">
                    <span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>
                    <span class="new-price">R$ ${product.price.toFixed(2)}</span>
                </div>
                
                <div class="stock-container">
                    <span class="stock-label">${stockText}</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill ${stockClass}" style="width: ${stockPercent}%"></div>
                    </div>
                </div>

                <button class="cta-button" style="margin-top: 1rem; padding: 0.5rem 2rem; font-size: 0.9rem;" onclick="addToCart(${product.id})">
                    ADICIONAR AO CARRINHO
                </button>
            `;
            productContainer.appendChild(card);
        });

        // Re-initialize scroll animations for new elements
        ScrollReveal().reveal('.product-card', {
            interval: 100,
            distance: '20px',
            origin: 'bottom',
            opacity: 0,
            duration: 800,
            easing: 'cubic-bezier(0.5, 0, 0, 1)'
        });
    }

    // --- Cart Logic ---
    window.addToCart = (id) => {
        const product = products.find(p => p.id === id);
        if (product) {
            cart.push(product);
            updateCartUI();

            // Visual feedback
            const btn = event.target;
            const originalText = btn.innerText;
            btn.innerText = "ADICIONADO! ✅";
            setTimeout(() => btn.innerText = originalText, 1000);
        }
    };

    function updateCartUI() {
        cartBtn.innerText = `Carrinho (${cart.length})`;
    }

    function checkout() {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let message = "Olá! Quero pedir os seguintes produtos do BLACK PODS: \n\n";
        let total = 0;

        cart.forEach(item => {
            message += `- ${item.name} (${item.flavors[0]}) - R$ ${item.price.toFixed(2)}\n`;
            total += item.price;
        });

        message += `\nTotal: R$ ${total.toFixed(2)}`;
        message += `\n\nAinda tem em estoque?`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/5511999999999?text=${encodedMessage}`, '_blank');
    }

    checkoutBtn.addEventListener('click', checkout);
    cartBtn.addEventListener('click', checkout); // Simple implementation: cart click goes to checkout

    // --- Filter Logic ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            renderProducts(filter);
        });
    });

    // --- Initial Render ---
    renderProducts();

    // --- Scroll Reveal Init ---
    ScrollReveal().reveal('.hero-content', {
        distance: '50px',
        origin: 'left',
        duration: 1000,
        delay: 200
    });
    ScrollReveal().reveal('.section-title', {
        distance: '30px',
        origin: 'top',
        duration: 1000,
        delay: 200
    });

    // --- Real-time Stock Simulation ---
    setInterval(() => {
        // Randomly decrease stock of a random product
        const randomProductIndex = Math.floor(Math.random() * products.length);
        if (products[randomProductIndex].stock > 1) {
            products[randomProductIndex].stock--;
            // Only re-render if visible? For simplicity, re-render if looking at all or relevant category
            // Getting active filter to know if we should update UI immediately
            const activeBtn = document.querySelector('.filter-btn.active');
            if (activeBtn) {
                // Optimization: Only re-render if necessary or just update DOM directly (simpler for now to just re-scan)
                // renderProducts(activeBtn.getAttribute('data-filter')); 
                // Updating simplified: Just update the specific card if found would be better but re-render is robust

                // Let's not re-render entire list every 5s as it resets scroll/animations. 
                // Just update the data. The next interaction will show new stock.
                // OR force update specific element.
            }
        }
    }, 5000);
});
