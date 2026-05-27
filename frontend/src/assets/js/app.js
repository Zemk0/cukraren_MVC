/**
 * app.js — Shared bootstrap loaded on every public page.
 *
 * Handles:
 *  - header / footer injection
 *  - active nav-link highlighting
 *  - mobile menu
 *  - smooth scroll
 */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       Header & footer injection
    ------------------------------------------------------------------ */
    function loadPartial(id, url, onLoaded) {
        const el = document.getElementById(id);
        if (!el) return;
        fetch(url)
            .then(r => r.text())
            .then(html => {
                el.innerHTML = html;
                if (typeof onLoaded === 'function') onLoaded();
            })
            .catch(err => console.error(`loadPartial(${url}):`, err));
    }

    function highlightNav() {
        const page = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('href') === page) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    /* ------------------------------------------------------------------
       Mobile menu
    ------------------------------------------------------------------ */
    function initMobileMenu() {
        const toggle  = document.querySelector('.menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        if (!toggle || !navMenu) return;

        function close() {
            toggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }

        toggle.addEventListener('click', e => {
            e.stopPropagation();
            const open = navMenu.classList.toggle('active');
            toggle.classList.toggle('active', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        navMenu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));

        document.addEventListener('click', e => {
            if (navMenu.classList.contains('active')
                    && !navMenu.contains(e.target)
                    && !toggle.contains(e.target)) close();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') close();
        });
    }

    /* ------------------------------------------------------------------
       Smooth scroll for anchor links
    ------------------------------------------------------------------ */
    function initSmoothScroll() {
        document.addEventListener('click', e => {
            const a = e.target.closest('a[href^="#"]');
            if (!a) return;
            const href = a.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }

    /* ------------------------------------------------------------------
       Init
    ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', () => {
        loadPartial('header_nav', 'header_nav.html', () => {
            highlightNav();
            initMobileMenu();
        });
        loadPartial('footer', 'footer.html');
        initSmoothScroll();
    });
})();
