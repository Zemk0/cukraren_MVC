/**
 * novinky.js — News page (novinky.html).
 * Requires: api.js
 */

(function () {
    'use strict';

    const PLACEHOLDER = 'assets/images/galeria/placeholder.png';

    function formatDate(str) {
        return new Date(str).toLocaleDateString('sk-SK',
            { year: 'numeric', month: 'long', day: 'numeric' });
    }

    async function loadAllNews() {
        const container = document.getElementById('news-articles');
        if (!container) return;

        container.innerHTML = '<p class="msg-center">Načítavam novinky…</p>';

        try {
            const news = await DataService.getNews();

            if (!news.length) {
                container.innerHTML = '<p class="msg-center">Zatiaľ žiadne novinky.</p>';
                return;
            }

            container.innerHTML = news.map(item => `
                <article class="news-article">
                    <div class="news-article-image">
                        <img src="${item.image || PLACEHOLDER}"
                             alt="${item.title}"
                             onerror="this.src='${PLACEHOLDER}'">
                    </div>
                    <div class="news-article-content">
                        <div class="news-article-date">${formatDate(item.date)}</div>
                        <h2 class="news-article-title">${item.title}</h2>
                        <div class="news-article-text">${item.content}</div>
                    </div>
                </article>`).join('');
        } catch (err) {
            console.error('loadAllNews:', err);
            container.innerHTML = '<p class="msg-center">Chyba pri načítaní noviniek.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', loadAllNews);
})();
