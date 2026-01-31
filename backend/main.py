import os
import bcrypt
import mysql.connector
import uuid
import re  
from datetime import datetime, timedelta
from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager

from google import genai

# =========================
# ENV & GEMINI SETUP
# =========================
load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🚀 Manobal Backend Started")
    yield
    print("🛑 Manobal Backend Stopped")

app = FastAPI(lifespan=lifespan)

# CORS Sync with Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# DB CONFIG
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
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ChatRequest(BaseModel):
    user_id: int
    prompt: str

class MoodEntry(BaseModel):
    user_id: int
    mood_score: int
    journal_entry: str

class AccessRequest(BaseModel):
    user_id: int
    professional_name: str
    duration_hours: int

class CounselorReg(BaseModel):
    name: str
    email: str
    password: str
    specialization: str
    experience: str
    available_from: str
    available_to: str
    meeting_link: str

# =========================
# 🔥 FIXED: AI RATING (Dynamic Score Fix)
# =========================
@app.post("/ai/mood_rating")
def get_ai_rating(req: ChatRequest):
    try:
        ai_prompt = (
            f"Analyze this mental health journal entry: '{req.prompt}'. "
            f"Provide a mood score (1-10) and a short supportive feedback sentence. "
            f"Format: Score: [number], Feedback: [text]"
        )
        
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=ai_prompt
        )
        
        full_text = response.text if response.text else "Reflection complete."
        
        # Extract score using Regex
        score_match = re.search(r"Score:\s*(\d+)", full_text)
        mood_score = int(score_match.group(1)) if score_match else 6
        
        analysis_feedback = full_text.split("Feedback:")[-1].strip() if "Feedback:" in full_text else full_text

        return {
            "mood_score": mood_score, 
            "analysis": analysis_feedback
        }
    except Exception as e:
        print(f"❌ AI Error: {e}")
        return {"mood_score": 5, "analysis": "System is busy. You can still save."}
    
# =========================
# 🔥 NEW: CHATBOT ROUTE (Missing Part)
# =========================
@app.post("/chatbot")
def chatbot(req: ChatRequest):
    try:
        # Using Gemini 2.5 Flash as requested
        response = client.models.generate_content(
            model="gemini-2.5-flash", 
            contents=req.prompt
        )
        
        if response.text:
            return {"response": response.text}
        else:
            return {"response": "Manobal is listening, but the connection is silent. Try again?"}
            
    except Exception as e:
        print(f"❌ Chatbot Error: {e}")
        return {"response": "The neural link is recalibrating. Please try in a moment."}

# =========================
# 🔥 FIXED: MOOD + STREAK (Streak Update Fix)
# =========================
@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        # AI Summary for Database
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"Summarize this in 10 words: {mood.journal_entry}"
        )
        analysis = response.text or "Entry logged."

        cursor.execute("""
            INSERT INTO mood_entries (user_id,mood_score,journal_entry,ai_analysis_text)
            VALUES (%s,%s,%s,%s)
        """, (mood.user_id, mood.mood_score, mood.journal_entry, analysis))

        # Streak Logic with DATEDIFF Fix
        cursor.execute("""
            INSERT INTO streaks (user_id, streak_count, last_updated)
            VALUES (%s, 1, CURRENT_DATE)
            ON DUPLICATE KEY UPDATE
            streak_count = CASE 
                WHEN DATEDIFF(CURRENT_DATE, last_updated) = 1 THEN streak_count + 1
                WHEN DATEDIFF(CURRENT_DATE, last_updated) > 1 THEN 1
                ELSE streak_count 
            END,
            last_updated = CURRENT_DATE
        """, (mood.user_id,))

        db.commit()
        return {"message": "Mood saved & streak synchronized"}
    except Exception as e:
        db.rollback()
        print(f"❌ DB Error: {e}")
        return {"error": str(e)}
    finally: cursor.close()

# =========================
# 🔥 FIXED: 404 HISTORY ERROR
# =========================
@app.get("/moods/{user_id}")
def moods(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT mood_score, journal_entry, ai_analysis_text, entry_date AS log_timestamp
        FROM mood_entries WHERE user_id=%s ORDER BY entry_date DESC LIMIT 20
    """, (user_id,))
    data = cursor.fetchall()
    cursor.close()
    return {"mood_entries": data}

# Alias for Dashboard history fetch to fix 404
@app.get("/moods/history/{user_id}")
def moods_history_alias(user_id: int, db=Depends(get_db)):
    return moods(user_id, db)

# =========================
# DASHBOARD & OTHERS
# =========================
@app.get("/dashboard/data/{user_id}")
def dashboard(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT streak_count FROM streaks WHERE user_id=%s", (user_id,))
    row = cursor.fetchone()
    cursor.close()
    return {"current_streak": row["streak_count"] if row else 0}

@app.post("/register")
def register(user: UserCreate, db=Depends(get_db)):
    cursor = db.cursor()
    hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    try:
        cursor.execute("INSERT INTO users (username,email,password_hash) VALUES (%s,%s,%s)", (user.username, user.email, hashed))
        db.commit()
        return {"message": "Registered"}
    finally: cursor.close()

@app.post("/login")
def login(user: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id,username,password_hash FROM users WHERE username=%s", (user.username,))
    data = cursor.fetchone()
    cursor.close()
    if not data or not bcrypt.checkpw(user.password.encode(), data["password_hash"].encode()):
        raise HTTPException(400, "Invalid login")
    return {"user_id": data["id"], "username": data["username"]}

# =========================
# 🔥 ADDED: TRUSTED ACCESS (Fixes 'Not Found' error)
# =========================
@app.post("/access/generate")
def generate_access(req: AccessRequest, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        token = str(uuid.uuid4())[:8].upper()
        expiry = datetime.now() + timedelta(hours=req.duration_hours)
        cursor.execute("""
            INSERT INTO access_tokens (user_id, access_token, professional_name, expires_at)
            VALUES (%s, %s, %s, %s)
        """, (req.user_id, token, req.professional_name, expiry))
        db.commit()
        return {"access_token": token, "expires_at": expiry}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, detail=str(e))
    finally: cursor.close()

@app.get("/access/view/{token}")
def view_access(token: str, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT user_id, expires_at FROM access_tokens WHERE access_token=%s", (token,))
    row = cursor.fetchone()
    if not row or row["expires_at"] < datetime.now():
        raise HTTPException(404, "Invalid or expired token")
    cursor.execute("SELECT mood_score, journal_entry, entry_date FROM mood_entries WHERE user_id=%s ORDER BY entry_date DESC LIMIT 20", (row["user_id"],))
    data = cursor.fetchall()
    cursor.close()
    return {"user_data_trends": data}

@app.get("/counselors/list")
def counselors_list(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id,name,specialization,experience,available_from,available_to,meeting_link FROM counselors")
    data = cursor.fetchall()
    cursor.close() 
    return data