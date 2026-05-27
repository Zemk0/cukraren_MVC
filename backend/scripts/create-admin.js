#!/usr/bin/env node
/**
 * scripts/create-admin.js
 *
 * Run once to create the initial admin account:
 *   node scripts/create-admin.js
 *
 * Requires DATABASE_* and JWT_SECRET env vars (same as the backend).
 * Uses dotenv if available, otherwise reads from process.env directly.
 */

import('dotenv/config').catch(() => {/* dotenv optional */});

import { createInterface } from 'node:readline';
import { AuthService }     from '../src/models/AuthService.js';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = q => new Promise(r => rl.question(q, r));

async function main() {
    console.log('\n=== Cukráreň Janka — Create Admin ===\n');

    const username = (await ask('Username: ')).trim();
    const password = (await ask('Password: ')).trim();

    if (!username || !password) {
        console.error('Username and password are required.');
        process.exit(1);
    }

    const svc = new AuthService();
    try {
        const { user, otpauthUri } = await svc.createAdmin(username, password);
        console.log(`\n✅  Admin "${user.username}" created.`);
        console.log('\n📱  Scan this URI with Google Authenticator / Authy:');
        console.log('\n   ', otpauthUri);
        console.log('\n   Or use an online QR generator — paste the URI above.');
        console.log('\n⚠️   Keep the URI secret — it gives full 2FA access.\n');
    } catch (err) {
        if (err.code === '23505') {
            console.error(`User "${username}" already exists.`);
        } else {
            console.error('Error:', err.message);
        }
        process.exit(1);
    } finally {
        rl.close();
        process.exit(0);
    }
}

main();
