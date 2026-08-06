# Task Manager — Full Stack Project

React (Vite) frontend + FastAPI backend + MySQL (local dev) / TiDB Cloud (production), JWT auth, deployed on Vercel + Render.

```
taskmanager/
├── backend/     FastAPI REST API
└── frontend/    React (Vite) SPA
```

## 1. Local backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Create the local database once:
```sql
CREATE DATABASE taskmanager;
```

Edit `.env`:
```
DATABASE_URL=mysql+pymysql://root:yourpassword@localhost:3306/taskmanager
JWT_SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
CORS_ORIGINS=http://localhost:5173
```

Run it:
```bash
uvicorn app.main:app --reload
```
Tables are auto-created on first run. API docs live at `http://localhost:8000/docs` — use them to test endpoints before wiring up the frontend.

## 2. Local frontend setup

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:8000
npm run dev
```
Visit `http://localhost:5173`, register a user, and start adding tasks.

## 3. Moving to TiDB Cloud (production database)

1. Sign up at tidbcloud.com and create a **Serverless** cluster (free tier).
2. Go to **Connect**, choose "General" → get host, port (4000), user, password.
3. Build your connection string:
   ```
   mysql+pymysql://<user>.root:<password>@<host>:4000/taskmanager?ssl_verify_cert=true&ssl_verify_identity=true
   ```
4. Create the database in the TiDB SQL console: `CREATE DATABASE taskmanager;`
5. You don't need to change any code — this is a drop-in replacement for your local `DATABASE_URL`.

## 4. Deploy backend to Render

1. Push this repo to GitHub.
2. In Render: **New → Web Service**, point it at the repo, root directory `backend`.
3. Build command: `pip install -r requirements.txt`
   Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add environment variables in Render's dashboard: `DATABASE_URL` (your TiDB URL), `JWT_SECRET_KEY`, `CORS_ORIGINS` (your Vercel URL, added after step 5).
5. Deploy. Note the Render URL, e.g. `https://taskmanager-api.onrender.com`.

(`render.yaml` in `backend/` documents these same settings if you use Render's Blueprint deploys.)

## 5. Deploy frontend to Vercel

1. In Vercel: **New Project**, point it at the repo, root directory `frontend`.
2. Framework preset: Vite. Build command `npm run build`, output `dist`.
3. Add environment variable `VITE_API_URL` = your Render backend URL.
4. Deploy. Then go back to Render and set `CORS_ORIGINS` to your Vercel URL so the backend accepts requests from it.

## API summary

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | — | Create account, returns JWT |
| POST | `/auth/login` | — | Log in, returns JWT |
| GET | `/auth/me` | ✅ | Current user info |
| GET | `/tasks/` | ✅ | List your tasks (optional `?status=` filter) |
| POST | `/tasks/` | ✅ | Create a task |
| GET | `/tasks/{id}` | ✅ | Get one task |
| PUT | `/tasks/{id}` | ✅ | Update a task (partial) |
| DELETE | `/tasks/{id}` | ✅ | Delete a task |

## Suggested next features (good for interview talking points)

- Task categories/projects (one-to-many, like tasks)
- Pagination + search on `/tasks/`
- Email verification or password reset flow
- Refresh tokens instead of long-lived access tokens
- Dockerfile for the backend so you can talk about containerization too
