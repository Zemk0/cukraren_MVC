/**
 * admin.js — Admin panel.
 * Requires: api.js
 */

(function () {
    'use strict';

    // Redirect to login if session is not set
    if (sessionStorage.getItem('adminLogged') !== 'true') {
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = '../admin-login.html';
    }

    /* ------------------------------------------------------------------
       Utilities
    ------------------------------------------------------------------ */
    const el  = id  => document.getElementById(id);
    const val = id  => el(id)?.value ?? '';

    function formatDate(str) {
        return new Date(str).toLocaleDateString('sk-SK',
            { year: 'numeric', month: 'long', day: 'numeric' });
    }

    function showAlert(message, type) {
        document.querySelectorAll('.alert-toast').forEach(a => a.remove());
        const toast = Object.assign(document.createElement('div'), {
            className:   `alert alert-${type} alert-toast`,
            textContent: message,
        });
        document.querySelector('.admin-container')?.prepend(toast);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => toast.remove(), 5000);
    }

    function previewImage(url, previewId) {
        const box = el(previewId);
        if (!box) return;
        if (!url) {
            box.innerHTML = '<div class="image-preview-placeholder">Náhľad obrázka</div>';
            return;
        }
        const src = url.startsWith('http') || url.startsWith('/') ? url : `../${url}`;
        box.innerHTML = `<img src="${src}" alt="Náhľad"
            onerror="this.replaceWith(Object.assign(document.createElement('div'),
                {className:'image-preview-placeholder',textContent:'Obrázok sa nenašiel'}))">`;
    }

    /* ------------------------------------------------------------------
       Dashboard
    ------------------------------------------------------------------ */
    async function initDashboard() {
        if (!el('products-count')) return;
        try {
            const [products, news, gallery] = await Promise.all([
                DataService.getProducts(),
                DataService.getNews(),
                DataService.getGallery(),
            ]);
            el('products-count').textContent = products.length;
            el('news-count').textContent     = news.length;
            el('gallery-count').textContent  = gallery.length;
        } catch (err) {
            console.error('initDashboard:', err);
        }
    }

    /* ------------------------------------------------------------------
       News
    ------------------------------------------------------------------ */
    async function renderNewsList() {
        const tbody = el('news-list');
        if (!tbody) return;
        try {
            const news = await DataService.getNews();
            if (!news.length) {
                tbody.innerHTML = '<tr><td colspan="4" class="msg-center">Žiadne novinky</td></tr>';
                return;
            }
            tbody.innerHTML = news.map(item => `
                <tr>
                    <td>${item.title}</td>
                    <td>${formatDate(item.date)}</td>
                    <td><img src="${item.image || '../assets/images/galeria/placeholder.png'}"
                             alt="" class="admin-thumb"
                             onerror="this.src='../assets/images/galeria/placeholder.png'"></td>
                    <td class="admin-table-actions">
                        <button class="btn-edit"   data-id="${item.id}">Upraviť</button>
                        <button class="btn-remove" data-id="${item.id}">Zmazať</button>
                    </td>
                </tr>`).join('');

            tbody.querySelectorAll('.btn-edit').forEach(btn =>
                btn.addEventListener('click', () => fillNewsForm(Number(btn.dataset.id))));
            tbody.querySelectorAll('.btn-remove').forEach(btn =>
                btn.addEventListener('click', () => confirmDeleteNews(Number(btn.dataset.id))));
        } catch (err) {
            console.error('renderNewsList:', err);
            tbody.innerHTML = '<tr><td colspan="4" class="msg-center">Chyba pri načítaní</td></tr>';
        }
    }

    async function fillNewsForm(id) {
        try {
            const item = await DataService.getNewsItem(id);
            if (!item) return;
            el('news-id').value      = item.id;
            el('news-title').value   = item.title;
            el('news-excerpt').value = item.excerpt ?? '';
            el('news-content').value = item.content;
            el('news-image').value   = item.image ?? '';
            previewImage(item.image, 'news-image-preview');
            el('news-form').scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error('fillNewsForm:', err);
        }
    }

    async function confirmDeleteNews(id) {
        if (!confirm('Naozaj chcete zmazať túto novinku?')) return;
        try {
            await DataService.deleteNews(id);
            showAlert('Novinka bola zmazaná.', 'success');
            await renderNewsList();
        } catch (err) {
            showAlert(`Chyba: ${err.message}`, 'error');
        }
    }

    function initNewsForm() {
        const form   = el('news-form');
        const cancel = el('news-cancel');
        if (!form) return;

        el('news-image')?.addEventListener('input', e =>
            previewImage(e.target.value, 'news-image-preview'));

        cancel?.addEventListener('click', () => {
            form.reset();
            el('news-id').value = '';
            previewImage('', 'news-image-preview');
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const id   = val('news-id');
            const data = {
                title:   val('news-title'),
                excerpt: val('news-excerpt'),
                content: val('news-content'),
                image:   val('news-image') || null,
            };
            try {
                id ? await DataService.updateNews(Number(id), data)
                   : await DataService.addNews(data);
                showAlert(id ? 'Novinka aktualizovaná.' : 'Novinka pridaná.', 'success');
                form.reset();
                el('news-id').value = '';
                previewImage('', 'news-image-preview');
                await renderNewsList();
            } catch (err) {
                showAlert(`Chyba: ${err.message}`, 'error');
            }
        });
    }

    /* ------------------------------------------------------------------
       Gallery
    ------------------------------------------------------------------ */
    async function renderGalleryList() {
        const tbody = el('gallery-list');
        if (!tbody) return;
        try {
            const gallery = await DataService.getGallery();
            if (!gallery.length) {
                tbody.innerHTML = '<tr><td colspan="3" class="msg-center">Žiadne obrázky</td></tr>';
                return;
            }
            tbody.innerHTML = gallery.map(item => `
                <tr>
                    <td><img src="${item.image || '../assets/images/galeria/placeholder.png'}"
                             alt="" class="admin-thumb admin-thumb--lg"
                             onerror="this.src='../assets/images/galeria/placeholder.png'"></td>
                    <td>${item.title}</td>
                    <td class="admin-table-actions">
                        <button class="btn-remove" data-id="${item.id}">Zmazať</button>
                    </td>
                </tr>`).join('');

            tbody.querySelectorAll('.btn-remove').forEach(btn =>
                btn.addEventListener('click', () => confirmDeleteGallery(Number(btn.dataset.id))));
        } catch (err) {
            console.error('renderGalleryList:', err);
            tbody.innerHTML = '<tr><td colspan="3" class="msg-center">Chyba pri načítaní</td></tr>';
        }
    }

    async function confirmDeleteGallery(id) {
        if (!confirm('Naozaj chcete zmazať tento obrázok?')) return;
        try {
            await DataService.deleteGalleryItem(id);
            showAlert('Obrázok bol zmazaný.', 'success');
            await renderGalleryList();
        } catch (err) {
            showAlert(`Chyba: ${err.message}`, 'error');
        }
    }

    function initGalleryForm() {
        const form   = el('gallery-form');
        const cancel = el('gallery-cancel');
        if (!form) return;

        el('gallery-image')?.addEventListener('input', e =>
            previewImage(e.target.value, 'gallery-image-preview'));

        cancel?.addEventListener('click', () => {
            form.reset();
            previewImage('', 'gallery-image-preview');
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const data = {
                title: val('gallery-title'),
                image: val('gallery-image') || null,
            };
            try {
                await DataService.addGalleryItem(data);
                showAlert('Obrázok bol pridaný.', 'success');
                form.reset();
                previewImage('', 'gallery-image-preview');
                await renderGalleryList();
            } catch (err) {
                showAlert(`Chyba: ${err.message}`, 'error');
            }
        });
    }

    /* ------------------------------------------------------------------
       Settings
    ------------------------------------------------------------------ */
    function initContactForm() {
        const form = el('contact-info-form');
        if (!form) return;

        // Load current values from API
        DataService.getSettings().then(s => {
            el('shop-name').value    = s.shopName ?? '';
            el('shop-address').value = s.address  ?? '';
            el('shop-city').value    = s.city      ?? '';
            el('shop-phone').value   = s.phone     ?? '';
            el('shop-email').value   = s.email     ?? '';
        }).catch(err => {
            console.error('loadSettings (contact):', err);
            showAlert('Nepodarilo sa načítať kontaktné údaje.', 'error');
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            try {
                await DataService.updateSettings({
                    shopName: val('shop-name'),
                    address:  val('shop-address'),
                    city:     val('shop-city'),
                    phone:    val('shop-phone'),
                    email:    val('shop-email'),
                });
                showAlert('Kontaktné údaje boli uložené.', 'success');
            } catch (err) {
                showAlert(`Chyba: ${err.message}`, 'error');
            }
        });
    }

    function initHoursForm() {
        const form = el('opening-hours-form');
        if (!form) return;

        // Load current values from API
        DataService.getSettings().then(s => {
            el('hours-weekdays').value = s.hoursWeekdays ?? '';
            el('hours-saturday').value = s.hoursSaturday ?? '';
            el('hours-sunday').value   = s.hoursSunday   ?? '';
        }).catch(err => {
            console.error('loadSettings (hours):', err);
            showAlert('Nepodarilo sa načítať otváracie hodiny.', 'error');
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            try {
                await DataService.updateSettings({
                    hoursWeekdays: val('hours-weekdays'),
                    hoursSaturday: val('hours-saturday'),
                    hoursSunday:   val('hours-sunday'),
                });
                showAlert('Otváracie hodiny boli uložené.', 'success');
            } catch (err) {
                showAlert(`Chyba: ${err.message}`, 'error');
            }
        });
    }

    /* ------------------------------------------------------------------
       Products
    ------------------------------------------------------------------ */
    const CATEGORY_LABELS = {
        torty:    'Torty',
        zakusky:  'Zákusky',
        kolace:   'Koláče',
        ostatne:  'Ostatné',
    };

    async function renderProductList() {
        const tbody = el('product-list');
        if (!tbody) return;
        try {
            const products = await DataService.getAllProducts();
            if (!products.length) {
                tbody.innerHTML = '<tr><td colspan="6" class="msg-center">Žiadne produkty</td></tr>';
                return;
            }
            tbody.innerHTML = products.map(p => `
                <tr>
                    <td>${p.name}</td>
                    <td>${CATEGORY_LABELS[p.category] ?? p.category}</td>
                    <td>${p.price}</td>
                    <td><img src="${("../" + p.image) || '../assets/images/produkty/placeholder.png'}"
                             alt="" class="admin-thumb"
                             onerror="this.src='../assets/images/produkty/placeholder.png'"></td>
                    <td>${p.isActive ? '✅ Aktívny' : '⛔ Neaktívny'}</td>
                    <td class="admin-table-actions">
                        <button class="btn-edit"   data-id="${p.id}">Upraviť</button>
                        <button class="btn-remove" data-id="${p.id}">Zmazať</button>
                    </td>
                </tr>`).join('');

            tbody.querySelectorAll('.btn-edit').forEach(btn =>
                btn.addEventListener('click', () => fillProductForm(Number(btn.dataset.id))));
            tbody.querySelectorAll('.btn-remove').forEach(btn =>
                btn.addEventListener('click', () => confirmDeleteProduct(Number(btn.dataset.id))));
        } catch (err) {
            console.error('renderProductList:', err);
            tbody.innerHTML = '<tr><td colspan="6" class="msg-center">Chyba pri načítaní</td></tr>';
        }
    }

    async function fillProductForm(id) {
        try {
            const p = await DataService.getProduct(id);
            if (!p) return;
            el('product-id').value          = p.id;
            el('product-name').value        = p.name;
            el('product-description').value = p.description ?? '';
            el('product-price').value       = p.price;
            el('product-category').value    = p.category;
            el('product-active').value      = String(p.isActive);
            el('product-image').value       = p.image ?? '';
            previewImage(p.image, 'product-image-preview');
            el('product-form').scrollIntoView({ behavior: 'smooth' });
        } catch (err) {
            console.error('fillProductForm:', err);
        }
    }

    async function confirmDeleteProduct(id) {
        if (!confirm('Naozaj chcete zmazať tento produkt?')) return;
        try {
            await DataService.deleteProduct(id);
            showAlert('Produkt bol zmazaný.', 'success');
            await renderProductList();
        } catch (err) {
            showAlert(`Chyba: ${err.message}`, 'error');
        }
    }

    function initProductForm() {
        const form   = el('product-form');
        const cancel = el('product-cancel');
        if (!form) return;

        el('product-image')?.addEventListener('input', e =>
            previewImage(e.target.value, 'product-image-preview'));

        cancel?.addEventListener('click', () => {
            form.reset();
            el('product-id').value = '';
            previewImage('', 'product-image-preview');
        });

        form.addEventListener('submit', async e => {
            e.preventDefault();
            const id   = val('product-id');
            const data = {
                name:        val('product-name'),
                description: val('product-description'),
                price:       val('product-price'),
                category:    val('product-category'),
                isActive:    val('product-active') === 'true',
                image:       val('product-image') || null,
            };
            try {
                id ? await DataService.updateProduct(Number(id), data)
                   : await DataService.addProduct(data);
                showAlert(id ? 'Produkt aktualizovaný.' : 'Produkt pridaný.', 'success');
                form.reset();
                el('product-id').value = '';
                previewImage('', 'product-image-preview');
                await renderProductList();
            } catch (err) {
                showAlert(`Chyba: ${err.message}`, 'error');
            }
        });
    }

    /* ------------------------------------------------------------------
       Bootstrap
    ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', () => {
        initDashboard();
        if (el('product-form'))       { renderProductList(); initProductForm();  }
        if (el('news-form'))          { renderNewsList();    initNewsForm();    }
        if (el('gallery-form'))       { renderGalleryList(); initGalleryForm(); }
        if (el('contact-info-form'))  initContactForm();
        if (el('opening-hours-form')) initHoursForm();
    });
})();
