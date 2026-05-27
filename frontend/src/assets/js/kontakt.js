/**
 * kontakt.js — Contact page (kontakt.html).
 * Loads shop info from nastavenia.json.
 */

(function () {
    'use strict';

    function el(id) { return document.getElementById(id); }

    async function loadContact() {
        try {
            const res = await fetch('assets/data/nastavenia.json');
            if (!res.ok) throw new Error(`nastavenia.json → ${res.status}`);
            const d = await res.json();

            el('contact-address').innerHTML = `${d.address}<br>${d.city}`;

            el('contact-phone').textContent = d.phone;
            el('contact-phone').href        = `tel:${d.phone.replace(/\s+/g, '')}`;

            el('contact-email').textContent = d.email;
            el('contact-email').href        = `mailto:${d.email}`;

            el('hours-weekdays').textContent = d.hours.weekdays;
            el('hours-saturday').textContent = d.hours.saturday;
            el('hours-sunday').textContent   = d.hours.sunday;

            el('shop-name').textContent = d.shopName;
            el('shop-city').textContent = d.city;
            el('map-link').href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d.shopName + ' ' + d.city)}`;
        } catch (err) {
            console.error('loadContact:', err);
        }
    }

    document.addEventListener('DOMContentLoaded', loadContact);
})();
