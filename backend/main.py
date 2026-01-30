# backend/main.py - Manobal (FINAL + STREAK FIXED)

import os
import bcrypt
import mysql.connector
from typing import Optional
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from contextlib import asynccontextmanager

from google import genai   # ✅ NEW SDK

# =========================
# ENV & GEMINI SETUP
# =========================
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise RuntimeError("❌ GEMINI_API_KEY missing in .env")

client = genai.Client(api_key=GEMINI_API_KEY)
print("✅ Gemini Client Ready (gemini-2.5-flash)")

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Manobal Backend Started")
    yield
    print("🛑 Manobal Backend Stopped")

app = FastAPI(lifespan=lifespan)

# =========================
# CORS
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DATABASE CONFIG
# =========================
db_config = {
    "host": "127.0.0.1",
    "user": "root",
    "password": "vig2006",
    "database": "suicide_awareness_db"
}

def get_db():
    conn = mysql.connector.connect(**db_config)
    try:
        yield conn
    finally:
        conn.close()

# =========================
# MODELS
# =========================
class ChatRequest(BaseModel):
    user_id: int
    prompt: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class MoodEntry(BaseModel):
    user_id: int
    mood_score: int
    journal_entry: str
    ai_analysis: Optional[str] = None

class CounselorRegSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    specialization: str
    experience: str
    available_from: str
    available_to: str
    meeting_link: str

# =========================
# AUTH
# =========================
@app.post("/register")
def register_user(user: UserCreate, db=Depends(get_db)):
    cursor = db.cursor()
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    cursor.execute(
        "INSERT INTO users (username, email, password_hash) VALUES (%s,%s,%s)",
        (user.username, user.email, hashed)
    )
    db.commit()
    cursor.close()
    return {"message": "User registered"}

@app.post("/login")
def login_user(user: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, username, password_hash FROM users WHERE username=%s",
        (user.username,)
    )
    data = cursor.fetchone()
    cursor.close()

    if not data or not bcrypt.checkpw(user.password.encode(), data["password_hash"].encode()):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {"user_id": data["id"], "username": data["username"]}

# =========================
# CHATBOT
# =========================
@app.post("/chatbot")
def chat_with_manobal(req: ChatRequest):
    try:
        system_prompt = (
            "You are Manobal AI, a calm, empathetic mental health companion. "
            "Be supportive, short, warm, and non-judgmental."
        )

        response = client.models.generate_content(
            model="models/gemini-2.5-flash",
            contents=f"{system_prompt}\n\nUser: {req.prompt}"
        )

        return {"response": response.text}

    except Exception as e:
        print("❌ CHATBOT ERROR:", e)
        return {"response": "Manobal is thinking deeply. Please try again."}

# =========================
# 🔥 STREAK HELPER (NEW)
# =========================
def update_streak_for_user(user_id: int, db):
    cursor = db.cursor()
    cursor.execute("SELECT streak_count FROM streaks WHERE user_id=%s", (user_id,))
    row = cursor.fetchone()

    if row:
        cursor.execute(
            "UPDATE streaks SET streak_count = streak_count + 1 WHERE user_id=%s",
            (user_id,)
        )
    else:
        cursor.execute(
            "INSERT INTO streaks (user_id, streak_count) VALUES (%s, 1)",
            (user_id,)
        )

    db.commit()
    cursor.close()

# =========================
# DASHBOARD
# =========================
@app.get("/dashboard/data/{user_id}")
def dashboard_data(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT streak_count FROM streaks WHERE user_id=%s", (user_id,))
    row = cursor.fetchone()
    cursor.close()
    return {"current_streak": row["streak_count"] if row else 0}

# =========================
# MOODS (✅ FIXED)
# =========================
@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    cursor.execute(
        "INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text) VALUES (%s,%s,%s,%s)",
        (mood.user_id, mood.mood_score, mood.journal_entry, mood.ai_analysis)
    )
    db.commit()
    cursor.close()

    # ✅ IMPORTANT: streak update after mood entry
    update_streak_for_user(mood.user_id, db)

    return {"message": "Mood saved & streak updated"}

@app.get("/moods/{user_id}")
def get_moods(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT mood_score, journal_entry, entry_date FROM mood_entries WHERE user_id=%s ORDER BY entry_date DESC LIMIT 10",
        (user_id,)
    )
    data = cursor.fetchall()
    cursor.close()
    return {"mood_entries": data}

# =========================
# COUNSELORS
# =========================
@app.get("/counselors/list")
def list_counselors(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute(
        "SELECT name, specialization, experience, meeting_link FROM counselors"
    )
    data = cursor.fetchall()
    cursor.close()
    return data
