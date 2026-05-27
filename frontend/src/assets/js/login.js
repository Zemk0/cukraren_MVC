/**
 * login.js — Admin login page logic.
 */

(function () {
    'use strict';

    const btn      = document.getElementById('login-btn');
    const errorEl  = document.getElementById('login-error');

    function showError(msg) {
        errorEl.textContent = msg;
        errorEl.style.display = 'block';
    }

    async function login() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        errorEl.style.display = 'none';

        try {
            const res = await fetch('assets/data/admin.json');
            if (!res.ok) throw new Error('Nepodarilo sa načítať admin config');
            const admin = await res.json();

            if (username === admin.username && password === admin.password) {
                sessionStorage.setItem('adminLogged', 'true');
                const redirect = sessionStorage.getItem('redirectAfterLogin') || 'admin/index.html';
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirect;
            } else {
                showError('Nesprávne prihlasovacie údaje');
            }
        } catch (err) {
            console.error('login:', err);
            showError('Chyba pri prihlasovaní');
        }
    }

    btn.addEventListener('click', login);

    document.addEventListener('keydown', e => {
        if (e.key === 'Enter') login();
    });
})();
