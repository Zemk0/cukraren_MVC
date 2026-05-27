-- Migration 003: create nastavenia table
-- Uloží nastavenia obchodu ako key-value páry.
-- Spustite raz nad databázou.

CREATE TABLE IF NOT EXISTS nastavenia
(
    key        TEXT        PRIMARY KEY,
    value      TEXT        NOT NULL DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed s predvolenými hodnotami (môžete prepísať cez admin panel)
INSERT INTO nastavenia (key, value) VALUES
    ('shopName',       'Cukráreň Janka'),
    ('address',        'Centrum 2 93/55'),
    ('city',           '018 41 Dubnica nad Váhom'),
    ('phone',          '+421 123 456 789'),
    ('email',          'info@cukrarenjanka.sk'),
    ('hoursWeekdays',  '6:00 - 18:00'),
    ('hoursSaturday',  '7:00 - 18:00'),
    ('hoursSunday',    '9:00 - 18:00')
ON CONFLICT (key) DO NOTHING;
