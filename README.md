# Cukráreň Janka — MVC refactor

Tento projekt je prepracovaná verzia [Zemk0/Cukraren_plus](https://github.com/Zemk0/Cukraren_plus)
do plnohodnotnej **MVC architektúry** podľa vzoru backendu z [vlx73/ssnd](https://github.com/vlx73/ssnd).

---

## Architektúra

```
┌──────────────┐     HTTP     ┌────────────────────────────────────────────────┐
│   Browser    │ ──────────── │            Reverse Proxy (nginx)               │
│  (frontend)  │              │  /api/*  → backend :8080                       │
└──────────────┘              │  /*      → frontend nginx :80                  │
                              └────────────────────────────────────────────────┘
                                          │               │
                              ┌───────────┘   ┌───────────┘
                         backend             frontend
                     (Node/Express)        (nginx + HTML/JS/CSS)
                          │
                     PostgreSQL
```

### MVC tok požiadavky (backend)

```
HTTP Request
    ↓
Router          src/routes/produktyRoutes.js
    ↓
Controller      src/controllers/ProduktController.js
    ├─ Filter   src/filters/ProduktFilter.js       ← sanitize / trim / normalize
    ├─ Validator src/validators/ProduktValidator.js ← business rules → errors[]
    ├─ Model    src/models/ProduktService.js        ← SQL, Entity mapping
    └─ View     src/views/ProduktView.js            ← JSON formatting, hide sensitive fields
    ↓
HTTP Response
```

---

## Štruktúra projektu

```
Cukraren_MVC/
├── backend/
│   ├── Dockerfile
│   ├── entry_point.sh
│   ├── index.js                          ← Express entry, mounts /api
│   ├── package.json
│   └── src/
│       ├── config/
│       │   └── database.js               ← PostgreSQL pool
│       ├── entities/
│       │   ├── Produkt.js
│       │   ├── Novinka.js
│       │   └── GaleriaItem.js
│       ├── filters/
│       │   ├── ProduktFilter.js
│       │   └── NovinkaFilter.js
│       ├── validators/
│       │   ├── ProduktValidator.js
│       │   └── NovinkaValidator.js
│       ├── models/
│       │   ├── ProduktService.js
│       │   ├── NovinkaService.js
│       │   └── GaleriaService.js
│       ├── controllers/
│       │   ├── ProduktController.js
│       │   ├── NovinkaController.js
│       │   └── GaleriaController.js
│       ├── views/
│       │   ├── ProduktView.js
│       │   ├── NovinkaView.js
│       │   └── GaleriaView.js
│       ├── routes/
│       │   ├── index.js                  ← /api/health + sub-routers
│       │   ├── produktyRoutes.js
│       │   ├── novinkyRoutes.js
│       │   └── galeriaRoutes.js
│       └── migrations/
│           └── 001_create_tables.sql
│
├── frontend/
│   ├── nginx.conf
│   └── src/
│       ├── index.html
│       ├── ponuka.html
│       ├── novinky.html
│       ├── galeria.html
│       ├── pribeh.html
│       ├── kontakt.html
│       ├── admin-login.html
│       ├── admin/
│       │   ├── index.html
│       │   ├── admin-novinky.html
│       │   ├── admin-galeria.html
│       │   └── admin-nastavenia.html
│       └── assets/
│           ├── css/
│           ├── js/
│           │   ├── api.js               ← NEW: DataService → REST API calls
│           │   ├── main.js              ← updated: uses DataService from api.js
│           │   ├── admin.js             ← updated: numeric IDs, getNewsItem()
│           │   ├── novinky.js
│           │   ├── ponuka.js
│           │   └── galeria.js
│           ├── data/                    ← static JSON (hero, featured, about)
│           └── images/
│
├── docker/
│   ├── docker-compose.yaml
│   └── .env.dist
└── reverse-proxy/
    ├── nginx.conf
    └── conf.d/
        └── app.conf
```

---

## API endpointy

| Metóda   | URL                    | Popis                              |
|----------|------------------------|------------------------------------|
| GET      | /api/health            | health check                       |
| GET      | /api/produkty          | všetky aktívne produkty            |
| GET      | /api/produkty?category=torty | filtrovanie podľa kategórie  |
| GET      | /api/produkty/:id      | jeden produkt                      |
| POST     | /api/produkty          | pridať produkt                     |
| PUT      | /api/produkty/:id      | aktualizovať produkt               |
| DELETE   | /api/produkty/:id      | zmazať produkt                     |
| GET      | /api/novinky           | všetky novinky (zoradené podľa dátumu) |
| GET      | /api/novinky/:id       | jedna novinka                      |
| POST     | /api/novinky           | pridať novinku                     |
| PUT      | /api/novinky/:id       | aktualizovať novinku               |
| DELETE   | /api/novinky/:id       | zmazať novinku                     |
| GET      | /api/galeria           | všetky obrázky                     |
| GET      | /api/galeria/:id       | jeden obrázok                      |
| POST     | /api/galeria           | pridať obrázok                     |
| DELETE   | /api/galeria/:id       | zmazať obrázok                     |

---

## Spustenie (Docker)

```bash
cd docker

# 1. Skopíruj .env a nastav heslá
cp .env.dist .env

# 2. Vytvor Docker sieť (raz)
docker network create cukraren

# 3. Spusti celý stack
docker compose up -d

# Web dostupný na:  http://localhost
# pgAdmin:          http://localhost:8081
```

Databázové tabuľky sa vytvoria automaticky pri prvom spustení PostgreSQL kontajnera
(súbor `backend/src/migrations/001_create_tables.sql` je namapovaný do
`/docker-entrypoint-initdb.d`).

---

## Čo sa zmenilo oproti pôvodnému projektu

| Pôvodný stav (Cukraren_plus)            | Nový stav (MVC)                              |
|-----------------------------------------|----------------------------------------------|
| Žiadny backend                          | Express.js API so štruktúrou MVC             |
| `storage.js` — CRUD cez `localStorage` | `api.js` — CRUD cez REST API                 |
| Dáta uložené v prehliadači (lokálne)    | Dáta uložené v PostgreSQL                    |
| JSON súbory ako "databáza"              | SQL tabuľky s migráciami                     |
| IDs generované ako `'news_' + Date.now()` | Sekvenčné BIGSERIAL ID z databázy          |
| Žiadne oddelenie logiky                 | Filter → Validator → Model → View            |
| Žiadny Docker compose pre backend       | Plný stack: rp + frontend + backend + db     |

---

## Ďalšie kroky (TODO)

- **Autentifikácia admina** — JWT middleware na `/api/` (vzor: `ssnd/backend/authentication`)
- **Upload obrázkov** — `multipart/form-data` endpoint, ukladanie do volumes
- **Nastavenia cez API** — pridať `NastaveniaController` + tabuľku `nastavenia`
- **Produkty v admin paneli** — formulár pre správu produktov
