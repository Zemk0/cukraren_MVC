/**
 * galeria.js — Gallery page (galeria.html).
 * Requires: api.js
 */

(function () {
    'use strict';

    const PLACEHOLDER = 'assets/images/galeria/placeholder.png';

    let images = [];
    let currentIndex = 0;

    /* ------------------------------------------------------------------
       Gallery grid
    ------------------------------------------------------------------ */
    async function loadGallery() {
        const container = document.getElementById('gallery-grid');
        if (!container) return;

        container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Načítavam galériu…</p>';

        try {
            images = await DataService.getGallery();

            if (!images.length) {
                container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Zatiaľ žiadne obrázky v galérii.</p>';
                return;
            }

            container.innerHTML = images.map((item, i) => `
                <div class="gallery-item" data-index="${i}">
                    <img src="${item.image || PLACEHOLDER}"
                         alt="${item.title}"
                         onerror="this.src='${PLACEHOLDER}'">
                    <div class="gallery-item-overlay">
                        <div class="gallery-item-title">${item.title}</div>
                    </div>
                </div>`).join('');

            container.querySelectorAll('.gallery-item').forEach(el => {
                el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index)));
            });
        } catch (err) {
            console.error('loadGallery:', err);
            container.innerHTML = '<p class="msg-center" style="grid-column:1/-1">Chyba pri načítaní galérie.</p>';
        }
    }

    /* ------------------------------------------------------------------
       Lightbox
    ------------------------------------------------------------------ */
    function openLightbox(index) {
        currentIndex = index;
        updateLightboxImage();
        document.getElementById('lightbox').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
        document.body.style.overflow = '';
    }

    function navigate(dir) {
        currentIndex = (currentIndex + dir + images.length) % images.length;
        updateLightboxImage();
    }

    function updateLightboxImage() {
        const item    = images[currentIndex];
        const imgEl   = document.getElementById('lightbox-image');
        const caption = document.getElementById('lightbox-caption');
        imgEl.src     = item.image || PLACEHOLDER;
        imgEl.alt     = item.title;
        if (caption) caption.textContent = item.title;
    }

    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
        document.querySelector('.lightbox-prev').addEventListener('click', () => navigate(-1));
        document.querySelector('.lightbox-next').addEventListener('click', () => navigate(1));

        lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if      (e.key === 'Escape')     closeLightbox();
            else if (e.key === 'ArrowLeft')  navigate(-1);
            else if (e.key === 'ArrowRight') navigate(1);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadGallery();
        initLightbox();
    });
})();
