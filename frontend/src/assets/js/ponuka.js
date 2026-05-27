/**
 * ponuka.js — Products page (ponuka.html).
 * Requires: api.js
 */

(function () {
    'use strict';

    const PLACEHOLDER = 'assets/images/produkty/placeholder.png';

    let allProducts = [];

    /* ------------------------------------------------------------------
       Render
    ------------------------------------------------------------------ */
    function renderProducts(products) {
        const container = document.getElementById('products-grid');
        if (!container) return;

        if (!products.length) {
            container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Žiadne produkty v tejto kategórii.</p>';
            return;
        }

        container.innerHTML = products.map(p => `
            <div class="product-card" data-category="${p.category}">
                <div class="product-image">
                    <img src="${p.image || PLACEHOLDER}"
                         alt="${p.name}"
                         onerror="this.src='${PLACEHOLDER}'">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <p class="product-description">${p.description}</p>
                    <div class="product-price">${p.price}</div>
                </div>
            </div>`).join('');
    }

    /* ------------------------------------------------------------------
       Filter buttons
    ------------------------------------------------------------------ */
    function initFilter() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const category = this.dataset.category;
                renderProducts(category === 'all'
                    ? allProducts
                    : allProducts.filter(p => p.category === category));
            });
        });
    }

    /* ------------------------------------------------------------------
       Load
    ------------------------------------------------------------------ */
    async function loadAllProducts() {
        const container = document.getElementById('products-grid');
        if (!container) return;

        container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Načítavam produkty…</p>';

        try {
            allProducts = await DataService.getProducts();
            renderProducts(allProducts);
        } catch (err) {
            console.error('loadAllProducts:', err);
            container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Chyba pri načítaní produktov.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadAllProducts();
        initFilter();
    });
})();
