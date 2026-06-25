from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import sys
import os
# Ensure project root is in sys.path so backend is importable from any directory
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

from .routers import auth, students, batches, attendance, insights, notifications
from .database import engine, Base, SessionLocal
from .models import Batch
from backend.seed import populate_defaults

# Automatically create database tables on app load
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Placement Training Portal API",
    description="Backend services for coordinating placement batches, student profiles, grades, and attendance logs.",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    db = SessionLocal()
    try:
        # Check if database is empty (no batches) and populate defaults
        if db.query(Batch).count() == 0:
            print("Database has no cohorts. Self-seeding default batch details and basic information...")
            populate_defaults(db)
    except Exception as e:
        print(f"Error seeding database defaults on startup: {e}")
    finally:
        db.close()

# Enable CORS for the local React development environments
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://formproject-2.onrender.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(students.router)
app.include_router(batches.router)
app.include_router(attendance.router)
app.include_router(insights.router)
app.include_router(notifications.router)

@app.get("/")
def read_root():
    return {"message": "Placement Training Portal API is running."}
