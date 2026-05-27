-- Migration 001: create core tables for Cukráreň Janka
-- Run once against the database to set up the schema.

-- Produkty
CREATE TABLE IF NOT EXISTS produkty
(
    id          BIGSERIAL   PRIMARY KEY,
    name        TEXT        NOT NULL,
    description TEXT        NOT NULL DEFAULT '',
    price       TEXT        NOT NULL,
    category    TEXT        NOT NULL DEFAULT 'ostatne',
    image       TEXT,
    is_active   BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Novinky
CREATE TABLE IF NOT EXISTS novinky
(
    id          BIGSERIAL   PRIMARY KEY,
    title       TEXT        NOT NULL,
    excerpt     TEXT,
    content     TEXT        NOT NULL DEFAULT '',
    image       TEXT,
    date        DATE        NOT NULL DEFAULT CURRENT_DATE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Galeria
CREATE TABLE IF NOT EXISTS galeria
(
    id          BIGSERIAL   PRIMARY KEY,
    title       TEXT        NOT NULL,
    image       TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
