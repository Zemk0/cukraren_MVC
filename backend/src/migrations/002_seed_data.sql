-- Seed data from frontend JSON files
-- Run once: paste into pgAdmin Query Tool and execute

INSERT INTO produkty (name, description, price, category, image) VALUES
    ('Šachové rezy',    'Klasický dezert s vanilkovým a kakaovým krémom', '2,50 €',     'zakusky', 'assets/images/produkty/obrazok.png'),
    ('Orechové koláče', 'Domáce koláče s orechovým posypom',              '1,80 €',     'kolace',  'assets/images/produkty/obrazok.png'),
    ('Čokoládová torta','Luxusná torta s čokoládovým krémom',              '25,00 €',    'torty',   'assets/images/produkty/obrazok.png'),
    ('Vanilkové rožky', 'Tradičné vianočné pečivo',                        '12,00 € /kg','pecivo',  'assets/images/produkty/obrazok.png'),
    ('Makové rezy',     'Lahodné rezy s makovou náplňou',                  '2,30 €',     'zakusky', 'assets/images/produkty/obrazok.png'),
    ('Ovocná torta',    'Torta s čerstvým ovocím a krémom',                '28,00 €',    'torty',   'assets/images/produkty/obrazok.png'),
    ('Linecké koláčiky','Krehké koláčiky s džemom',                        '10,00 € /kg','pecivo',  'assets/images/produkty/obrazok.png'),
    ('Medovník',        'Tradičný medový koláč s krémom',                  '3,20 €',     'kolace',  'assets/images/produkty/obrazok.png'),
    ('Jahodová torta',  'Torta s čerstvými jahodami',                      '30,00 €',    'torty',   'assets/images/produkty/obrazok.png')
ON CONFLICT DO NOTHING;

INSERT INTO novinky (title, excerpt, content, date, image) VALUES
    (
        'Nové vianočné pečivo v ponuke',
        'Od 1. decembra máme v ponuke širokú škálu vianočného pečiva. Objednávky prijímame už teraz!',
        'Od 1. decembra máme v ponuke širokú škálu vianočného pečiva. Pripravili sme pre vás tradičné vanilkové rožky, linecké koláčiky, medovníky a mnoho ďalších dobrôt. Objednávky prijímame už teraz telefonicky alebo osobne v našej prevádzke.',
        '2026-01-05',
        'assets/images/galeria/obrazok.png'
    ),
    (
        'Valentínske torty na objednávku',
        'Darujte svojím blízkym niečo výnimočné. Valentínske torty na objednávku do 10. februára.',
        'Valentín sa blíži! Darujte svojím blízkym niečo výnimočné - našu domácu tortu v tvare srdca. Výber z viacerých príchutí: čokoládová, jahodová, či vanilková. Objednávky prijímame do 10. februára.',
        '2026-01-03',
        'assets/images/galeria/obrazok.png'
    ),
    (
        'Nové otváracie hodiny',
        'Od januára máme rozšírené otváracie hodiny. Teraz otvorené aj v sobotu do 14:00.',
        'Máme pre vás skvelú správu! Od januára máme rozšírené otváracie hodiny. Počas pracovných dní sme otvorení od 7:00 do 18:00 a v sobotu od 8:00 do 14:00. Tešíme sa na vašu návštevu!',
        '2025-12-28',
        'assets/images/banner/obrazok.png'
    )
ON CONFLICT DO NOTHING;

INSERT INTO galeria (title, image) VALUES
    ('Svadobná torta',   'https://th.bing.com/th/id/OIP.YiIyiXseROqmryb07kLpbQHaHa?w=198&h=198&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3'),
    ('Čokoládové rezy',  'assets/images/galeria/obrazok.png'),
    ('Ovocné koláče',    'assets/images/galeria/obrazok.png'),
    ('Detská torta',     'assets/images/galeria/obrazok.png'),
    ('Makové rezy',      'assets/images/galeria/obrazok.png'),
    ('Svadobná torta 2', 'assets/images/galeria/obrazok.png'),
    ('Vianočné pečivo',  'assets/images/galeria/obrazok.png'),
    ('Medovník',         'assets/images/galeria/obrazok.png'),
    ('Ovocná torta',     'assets/images/galeria/obrazok.png')
ON CONFLICT DO NOTHING;
