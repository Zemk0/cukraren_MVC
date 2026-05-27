/**
 * main.js — Home page sections (index.html only).
 * Requires: api.js
 */

(function () {
    'use strict';

    const PLACEHOLDER = {
        product: 'assets/images/produkty/placeholder.png',
        news:    'assets/images/galeria/placeholder.png',
        general: 'assets/images/banner/placeholder.png',
    };

    /* ------------------------------------------------------------------
       Helpers
    ------------------------------------------------------------------ */
    function el(id) { return document.getElementById(id); }

    function formatDate(str) {
        return new Date(str).toLocaleDateString('sk-SK',
            { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function msgHtml(text) {
        return `<p style="text-align:center;color:var(--color-text-medium);grid-column:1/-1">${text}</p>`;
    }

    /* ------------------------------------------------------------------
       Products (home preview — first 6)
    ------------------------------------------------------------------ */
    async function loadHomeProducts() {
        const container = el('home-products');
        if (!container) return;
        container.innerHTML = msgHtml('Načítavam produkty…');

        try {
            const products = (await DataService.getProducts()).slice(0, 6);
            if (!products.length) { container.innerHTML = msgHtml('Zatiaľ žiadne produkty.'); return; }

            container.innerHTML = products.map(p => `
                <div class="product-card" data-category="${p.category}">
                    <div class="product-image">
                        <img src="${p.image || PLACEHOLDER.product}"
                             alt="${p.name}"
                             onerror="this.src='${PLACEHOLDER.product}'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${p.name}</h3>
                        <p class="product-description">${p.description}</p>
                        <div class="product-price">${p.price}</div>
                    </div>
                </div>`).join('');
        } catch (err) {
            console.error('loadHomeProducts:', err);
            container.innerHTML = msgHtml('Chyba pri načítaní produktov.');
        }
    }

    /* ------------------------------------------------------------------
       News (home preview — first 3)
    ------------------------------------------------------------------ */
    async function loadHomeNews() {
        const container = el('home-news');
        if (!container) return;
        container.innerHTML = msgHtml('Načítavam novinky…');

        try {
            const news = (await DataService.getNews()).slice(0, 3);
            if (!news.length) { container.innerHTML = msgHtml('Zatiaľ žiadne novinky.'); return; }

            container.innerHTML = news.map(item => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.image || PLACEHOLDER.news}"
                             alt="${item.title}"
                             onerror="this.src='${PLACEHOLDER.news}'">
                    </div>
                    <div class="news-content">
                        <div class="news-date">${formatDate(item.date)}</div>
                        <h3 class="news-title">${item.title}</h3>
                        <p class="news-excerpt">${item.excerpt ?? ''}</p>
                        <a href="novinky.html" class="news-link">Čítať viac →</a>
                    </div>
                </div>`).join('');
        } catch (err) {
            console.error('loadHomeNews:', err);
            container.innerHTML = msgHtml('Chyba pri načítaní noviniek.');
        }
    }

    /* ------------------------------------------------------------------
       Static JSON sections (hero, featured, about)
       These come from local JSON until a /api/nastavenia endpoint is added.
    ------------------------------------------------------------------ */
    async function loadJson(path) {
        const res = await fetch(path);
        if (!res.ok) throw new Error(`${path} → ${res.status}`);
        return res.json();
    }

    async function loadHero() {
        const section = el('hero-section');
        if (!section) return;
        try {
            const d = await loadJson('assets/data/hero.json');
            section.innerHTML = `
                <div class="hero-content">
                    <div class="hero-image">
                        <img src="${d.image}" alt="${d.imageAlt}">
                        <div class="hero-overlay">
                            <h2 class="hero-title">${d.title}</h2>
                            <p class="hero-subtitle">${d.subtitle}</p>
                            <a href="${d.buttonLink}" class="btn-hero">${d.buttonText}</a>
                        </div>
                    </div>
                </div>`;
        } catch (err) { console.error('loadHero:', err); }
    }

    async function loadFeatured() {
        const container = el('featured-section');
        if (!container) return;
        try {
            const items = await loadJson('assets/data/featured.json');
            container.innerHTML = items.map(item => `
                <div class="featured-card">
                    <div class="featured-image">
                        <img src="${item.image}" alt="${item.alt}">
                    </div>
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                </div>`).join('');
        } catch (err) { console.error('loadFeatured:', err); }
    }

    async function loadAbout() {
        const container = el('about-section');
        if (!container) return;
        try {
            const d = await loadJson('assets/data/about.json');
            container.innerHTML = `
                <div class="about-content">
                    <div class="about-text">
                        <h2 class="section-title">${d.title}</h2>
                        ${d.paragraphs.map(p => `<p>${p}</p>`).join('')}
                        <a href="${d.buttonLink}" class="btn-primary">${d.buttonText}</a>
                    </div>
                    <div class="about-image">
                        <img src="${d.image}" alt="${d.imageAlt}">
                    </div>
                </div>`;
        } catch (err) { console.error('loadAbout:', err); }
    }

    /* ------------------------------------------------------------------
       Init
    ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', () => {
        loadHero();
        loadFeatured();
        loadAbout();
        loadHomeProducts();
        loadHomeNews();
    });
})();
