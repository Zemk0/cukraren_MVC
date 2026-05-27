-- Migration 004: create admin_users table
-- Stores admin accounts with bcrypt password hash and TOTP secret for 2FA.

CREATE TABLE IF NOT EXISTS admin_users
(
    id            BIGSERIAL    PRIMARY KEY,
    username      TEXT         NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    totp_secret   TEXT         NOT NULL,          -- base32 TOTP secret (encrypted at rest recommended)
    totp_enabled  BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- Seed: default admin account
-- Username  : admin
-- Password  : admin123   (change immediately after first login!)
-- TOTP      : scan the QR code shown in setup, or use secret below
--
-- To generate a proper hash + secret run:
--   node scripts/create-admin.js
-- -----------------------------------------------------------------------
