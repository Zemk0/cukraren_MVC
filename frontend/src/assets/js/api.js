/**
 * DataService — komunikuje s REST API backendu.
 *
 * Všetky metódy sú async a vracajú dáta alebo vyhodia Error.
 * Komponenty (main.js, novinky.js, ...) volajú len tieto metódy
 * a nikdy nevolajú fetch() priamo.
 */
const DataService = (() => {

    const BASE = '/api';

    // -------------------------------------------------------------------------
    // Interné pomocné metódy
    // -------------------------------------------------------------------------

    function _authHeaders(extra = {}) {
        const token = sessionStorage.getItem('adminToken');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...extra,
        };
    }

    function _handle401(res) {
        if (res.status === 401) {
            sessionStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminLogged');
            sessionStorage.setItem('redirectAfterLogin', window.location.href);
            window.location.href = '../admin-login.html';
            return true;
        }
        return false;
    }

    async function _get(path) {
        const res = await fetch(BASE + path, { headers: _authHeaders() });
        if (_handle401(res)) return;
        if (!res.ok) throw new Error(`GET ${path} zlyhalo: ${res.status}`);
        return res.json();
    }

    async function _post(path, body) {
        const res = await fetch(BASE + path, {
            method:  'POST',
            headers: _authHeaders(),
            body:    JSON.stringify(body),
        });
        _handle401(res);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err.errors ?? [err.message ?? `POST ${path} zlyhalo`]).join(', '));
        }
        return res.json();
    }

    async function _put(path, body) {
        const res = await fetch(BASE + path, {
            method:  'PUT',
            headers: _authHeaders(),
            body:    JSON.stringify(body),
        });
        _handle401(res);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err.errors ?? [err.message ?? `PUT ${path} zlyhalo`]).join(', '));
        }
        return res.json();
    }

    async function _patch(path, body) {
        const res = await fetch(BASE + path, {
            method:  'PATCH',
            headers: _authHeaders(),
            body:    JSON.stringify(body),
        });
        _handle401(res);
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err.errors ?? [err.message ?? `PATCH ${path} zlyhalo`]).join(', '));
        }
        return res.json();
    }

    async function _delete(path) {
        const res = await fetch(BASE + path, { method: 'DELETE', headers: _authHeaders() });
        _handle401(res);
        if (!res.ok) throw new Error(`DELETE ${path} zlyhalo: ${res.status}`);
    }

    // -------------------------------------------------------------------------
    // Produkty
    // -------------------------------------------------------------------------

    async function getProducts(category = null) {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        return _get(`/produkty${query}`);
    }
    
    async function getAllProducts() {
        return _get('/produkty/all');
    }

    async function getProduct(id) {
        return _get(`/produkty/${id}`);
    }

    async function addProduct(data) {
        return _post('/produkty', data);
    }

    async function updateProduct(id, data) {
        return _put(`/produkty/${id}`, data);
    }

    async function deleteProduct(id) {
        return _delete(`/produkty/${id}`);
    }

    // -------------------------------------------------------------------------
    // Novinky
    // -------------------------------------------------------------------------

    async function getNews() {
        return _get('/novinky');
    }

    async function getNewsItem(id) {
        return _get(`/novinky/${id}`);
    }

    async function addNews(data) {
        return _post('/novinky', data);
    }

    async function updateNews(id, data) {
        return _put(`/novinky/${id}`, data);
    }

    async function deleteNews(id) {
        return _delete(`/novinky/${id}`);
    }

    // -------------------------------------------------------------------------
    // Galéria
    // -------------------------------------------------------------------------

    async function getGallery() {
        return _get('/galeria');
    }

    async function addGalleryItem(data) {
        return _post('/galeria', data);
    }

    async function deleteGalleryItem(id) {
        return _delete(`/galeria/${id}`);
    }

    // -------------------------------------------------------------------------
    // Nastavenia
    // -------------------------------------------------------------------------

    /** Vráti všetky nastavenia ako { shopName, address, city, … } */
    async function getSettings() {
        return _get('/nastavenia');
    }

    /**
     * Uloží všetky nastavenia naraz.
     * @param {{ shopName, address, city, phone, email,
     *           hoursWeekdays, hoursSaturday, hoursSunday }} data
     */
    async function updateSettings(data) {
        return _put('/nastavenia', data);
    }

    /**
     * Aktualizuje jednu hodnotu.
     * @param {string} key
     * @param {string} value
     */
    async function updateSetting(key, value) {
        return _patch(`/nastavenia/${key}`, { value });
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    return {
        getProducts,
        getAllProducts,
        getProduct,
        addProduct,
        updateProduct,
        deleteProduct,

        getNews,
        getNewsItem,
        addNews,
        updateNews,
        deleteNews,

        getGallery,
        addGalleryItem,
        deleteGalleryItem,

        getSettings,
        updateSettings,
        updateSetting,
    };

})();
