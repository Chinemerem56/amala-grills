const cart = [];
const phoneNumber = '+2347058461475';

function renderOrderPanel() {
    const orderList = document.getElementById('orderList');
    const cartItemsText = document.getElementById('cartItemsText');

    if (!orderList) return;

    if (!cart.length) {
        orderList.innerHTML = '<p class="empty-order">No item selected yet.</p>';
        if (cartItemsText) cartItemsText.textContent = '0 items';
        return;
    }

    orderList.innerHTML = cart.map((item, index) => `
        <div class="order-item">
            <span>${index + 1}. ${item.product}</span>
            <button type="button" data-index="${index}" aria-label="Remove ${item.product}">×</button>
        </div>
    `).join('');

    if (cartItemsText) cartItemsText.textContent = `${cart.length} item${cart.length === 1 ? '' : 's'}`;

    orderList.querySelectorAll('button[data-index]').forEach((button) => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            cart.splice(index, 1);
            renderOrderPanel();
        });
    });
}

function openOrderPanel() {
    const panel = document.getElementById('orderPanel');
    if (panel) panel.classList.add('open');
}

function closeOrderPanel() {
    const panel = document.getElementById('orderPanel');
    if (panel) panel.classList.remove('open');
}

function toggleOrderPanel() {
    const panel = document.getElementById('orderPanel');
    if (!panel) return;
    if (panel.classList.contains('open')) {
        closeOrderPanel();
    } else {
        openOrderPanel();
    }
}

function addToCart(product) {
    cart.push({ product });
    renderOrderPanel();
    openOrderPanel();
}

function sendCartToWhatsApp() {
    if (!cart.length) {
        alert('Your cart is empty. Add a meal to continue.');
        return;
    }

    const orderText = cart
        .map((item, index) => `${index + 1}. ${item.product}`)
        .join('\n');

    const message = `Hello, I would like to order the following:\n\n${orderText}`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

function openOwnerChat() {
    const message = encodeURIComponent('Hello, I want to chat with the owner directly.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-cart-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const product = button.dataset.product;
            addToCart(product);
            button.textContent = 'Added';
            button.disabled = true;
            setTimeout(() => {
                button.textContent = 'Add to cart';
                button.disabled = false;
            }, 800);
        });
    });

    const cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        cartSummary.addEventListener('click', toggleOrderPanel);
    }

    const closePanel = document.getElementById('closePanel');
    if (closePanel) {
        closePanel.addEventListener('click', closeOrderPanel);
    }

    document.addEventListener('click', (event) => {
        const panel = document.getElementById('orderPanel');
        const cartSummary = document.getElementById('cartSummary');
        if (!panel || !cartSummary) return;
        const clickedInsidePanel = panel.contains(event.target);
        const clickedCart = cartSummary.contains(event.target);
        if (panel.classList.contains('open') && !clickedInsidePanel && !clickedCart) {
            closeOrderPanel();
        }
    });

    const whatsappBtn = document.getElementById('whatsappBtn');
    const panelWhatsAppBtn = document.getElementById('panelWhatsAppBtn');
    const directWhatsAppBtn = document.getElementById('directWhatsAppBtn');

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            if (cart.length) {
                sendCartToWhatsApp();
            } else {
                openOwnerChat();
            }
        });
    }

    if (panelWhatsAppBtn) {
        panelWhatsAppBtn.addEventListener('click', sendCartToWhatsApp);
    }

    if (directWhatsAppBtn) {
        directWhatsAppBtn.addEventListener('click', openOwnerChat);
    }

    renderOrderPanel();
});
