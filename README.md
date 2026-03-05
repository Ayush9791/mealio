# Mealio

Mealio is a full-stack app that connects restaurants with NGOs to redistribute surplus food.

## Add PostgreSQL server (local setup)

You have two easy options:

### Option A: Docker (recommended)

1. Start PostgreSQL with Docker Compose:
   ```bash
   docker compose up -d postgres
   ```
2. This automatically creates:
   - DB: `mealio`
   - User: `postgres`
   - Password: `postgres`
3. The schema is auto-loaded from `database/schema.sql` on first startup.
4. Verify database is running:
   ```bash
   docker compose ps
   ```

### Option B: Existing local PostgreSQL

1. Create a database named `mealio`.
2. Run schema manually:
   ```bash
   psql -U postgres -d mealio -f database/schema.sql
   ```

## Configure the backend

1. Copy env template:
   ```bash
   cp server/.env.example server/.env
   ```
2. Edit `server/.env` and set `DATABASE_URL` + `JWT_SECRET`.

Example:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mealio
JWT_SECRET=super-secret-value
```

## Run the app

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

Frontend default: `http://localhost:5173`  
Backend default: `http://localhost:5000`

## Quick API check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"ok"}
```
