from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.config import settings
from app.routers import auth_routes, tasks

# Creates tables if they don't exist yet (fine for a portfolio project;
# use Alembic migrations if this grows into something bigger)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Task Manager API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(tasks.router)


@app.get("/")
def health_check():
    return {"status": "ok", "service": "task-manager-api"}
