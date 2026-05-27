# Pripojenie k databáze — Cukráreň Janka

## Ako to funguje

Backend sa pripája k PostgreSQL cez `pg.Pool`.
Konfigurácia sa číta **výhradne z environment premenných** — nikdy z kódu.

```
backend/src/config/database.js
        ↓
    pg.Pool({ host, port, database, user, password })
        ↓
    PostgreSQL kontajner (cukraren-db)
```

---

## 1. Nastavenie .env

Skopíruj šablónu a zmeň heslá:

```bash
cp docker/.env.dist docker/.env
```

Obsah `.env`:

```env
POSTGRES_HOST=cukraren-db
POSTGRES_PORT=5432
POSTGRES_DB=cukraren
POSTGRES_USER=cukraren_user
POSTGRES_PASSWORD=zmen_ma
```

> `POSTGRES_HOST` musí byť **názov kontajnera** (`cukraren-db`), nie `localhost`.
> Docker Compose prepojí kontajnery podľa názvu cez sieť `ssnd`.

---

## 2. Vytvorenie tabuliek

Migrácia sa spustí **automaticky** pri prvom štarte PostgreSQL kontajnera.
Docker namapuje SQL súbor do `/docker-entrypoint-initdb.d/`:

```yaml
# docker-compose.yaml
volumes:
  - ../backend/src/migrations:/docker-entrypoint-initdb.d:ro
```

Súbor `001_create_tables.sql` vytvorí:

| Tabuľka   | Popis                        |
|-----------|------------------------------|
| produkty  | Produkty s kategóriou a cenou |
| novinky   | Novinky / aktuality          |
| galeria   | Obrázky v galérii            |

Ak tabuľky **už existujú**, migrácia sa preskočí (príkaz `CREATE TABLE IF NOT EXISTS`).

---

## 3. Štart celého stacku

```bash
cd docker
docker compose up -d
```

Poradie štartu:
1. `cukraren-db` — PostgreSQL, spustí migráciu
2. `cukraren-backend` — Node.js, čaká na DB
3. `cukraren-frontend` — nginx, statické súbory
4. `cukraren-rp` — reverse proxy, smeruje `/api/*` na backend

---

## 4. Overenie pripojenia

```bash
# Logy backendu
docker logs cukraren-backend

# Priamo do DB cez psql
docker exec -it cukraren-db psql -U cukraren_user -d cukraren

# Príkazy v psql
\dt                    -- zoznam tabuliek
SELECT * FROM produkty;
SELECT * FROM novinky;
SELECT * FROM galeria;
\q                     -- koniec
```

pgAdmin je dostupný na `http://localhost:8081`
(prihlasovacie údaje sú z `.env`: `PGADMIN_DEFAULT_EMAIL` a `PGADMIN_DEFAULT_PASSWORD`).

---

## 5. MVC tok pri každej požiadavke

Každá HTTP požiadavka prejde týmto reťazcom:

```
Browser
  │
  ▼
Reverse Proxy (nginx :80)
  │  /api/*  →  backend
  │  /*      →  frontend (statické HTML/JS/CSS)
  ▼
Controller  — prijme req, zavolá Filter + Validator
  │
  ▼
Filter      — oreže a normalizuje req.body (trim, toLowerCase…)
  │
  ▼
Validator   — skontroluje biznis pravidlá, vráti errors[]
  │
  ▼
Service     — vykoná SQL cez pg.Pool, namapuje riadky na Entity
  │
  ▼
View        — naformátuje JSON odpoveď, skryje interné polia
  │
  ▼
Browser
```

### Konkrétny príklad — POST /api/novinky

```
req.body = { title: "  Nová torta  ", content: "..." }

NovinkaController.store()
    NovinkaFilter.forCreate(req.body)
        → { title: "Nová torta", content: "..." }   ← trim
    NovinkaValidator.forCreate(data)
        → []                                          ← žiadne chyby
    NovinkaService.create(data)
        → INSERT INTO novinky ... RETURNING *
        → new Novinka({ id: 7, title: "Nová torta", ... })
    NovinkaView.created(res, novinka)
        → HTTP 201  { id: 7, title: "Nová torta", ... }
```

---

## 6. Pridanie nového endpointu (vzor)

Chceš napr. `GET /api/nastavenia` pre kontaktné údaje:

### 1. Entita
```js
// src/entities/Nastavenie.js
export class Nastavenie {
    constructor({ id, key, value }) {
        this.id    = id;
        this.key   = key;
        this.value = value;
    }
}
```

### 2. Service (Model)
```js
// src/models/NastaveniaService.js
export class NastaveniaService {
    async findAll() {
        const { rows } = await pool.query('SELECT * FROM nastavenia');
        return rows.map(r => new Nastavenie(r));
    }
    async upsert(key, value) {
        const { rows } = await pool.query(
            `INSERT INTO nastavenia (key, value)
             VALUES ($1, $2)
             ON CONFLICT (key) DO UPDATE SET value = $2
             RETURNING *`,
            [key, value]
        );
        return new Nastavenie(rows[0]);
    }
}
```

### 3. Controller
```js
// src/controllers/NastaveniaController.js
export class NastaveniaController {
    async index(req, res, next) {
        try {
            const items = await nastaveniaService.findAll();
            res.json(items);
        } catch (err) { next(err); }
    }
}
```

### 4. Route
```js
// src/routes/nastaveniaRoutes.js
router.get('/', (req, res, next) => ctrl.index(req, res, next));
```

### 5. Zaregistrovať v index.js
```js
router.use('/nastavenia', nastaveniaRoutes);
```

---

## 7. Bežné problémy

| Chyba | Príčina | Riešenie |
|-------|---------|----------|
| `ECONNREFUSED` | Backend štartuje skôr ako DB | `docker compose restart cukraren-backend` |
| `relation "produkty" does not exist` | Migrácia sa nespustila | `docker exec cukraren-db psql -U ... -f /docker-entrypoint-initdb.d/001_create_tables.sql` |
| `password authentication failed` | Zlé heslo v `.env` | Skontroluj `.env`, znovu `docker compose down -v && up -d` |
| `pool overlap` | Sieť existuje s iným rozsahom | Pozri `docker network ls`, nastav `external: true` v compose |
