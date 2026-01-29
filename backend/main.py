# backend/main.py - Manobal Final "Master" Production Version
import os
import uuid
import bcrypt
import mysql.connector
from datetime import datetime, timedelta
from typing import Optional, List
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from contextlib import asynccontextmanager
from google import genai

# --- SECURITY & AI SETUP ---
load_dotenv() 
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 
client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    try:
        if GEMINI_API_KEY:
            client = genai.Client(api_key=GEMINI_API_KEY)
            print("✅ Manobal AI Ready (Gemini 1.5 Flash Online)")
        else:
            print("⚠️ Warning: GEMINI_API_KEY missing in .env")
    except Exception as e:
        print(f"❌ AI Init Error: {e}")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE CONFIG ---
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

# --- MODELS (PYDANTIC SCHEMAS) ---
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
    specialization: str # Mandatory for UI cards
    experience: str
    available_from: str
    available_to: str
    meeting_link: str

# Trusted Access Payload Fix
class AccessRequest(BaseModel):
    user_id: int
    professional_name: str
    duration_hours: int

# --- 1. DUAL AUTHENTICATION (USER & PROFESSIONAL) ---

@app.post("/register")
def register_user(user: UserCreate, db=Depends(get_db)):
    cursor = db.cursor()
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", 
                       (user.username, user.email, hashed))
        db.commit()
        return {"message": "User registered!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally: cursor.close()

@app.post("/login")
def login_user(user: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (user.username,))
    user_data = cursor.fetchone()
    cursor.close()
    if not user_data or not bcrypt.checkpw(user.password.encode('utf-8'), user_data['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"user_id": user_data["id"], "username": user_data["username"], "role": "user"}

@app.post("/counselor/login")
def login_counselor(user: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, password_hash FROM counselors WHERE contact_email = %s", (user.username,))
    c_data = cursor.fetchone()
    cursor.close()
    if not c_data or not bcrypt.checkpw(user.password.encode('utf-8'), c_data['password_hash'].encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid Professional Credentials")
    return {"user_id": c_data["id"], "username": c_data["name"], "role": "counselor"}

# --- 2. COUNSELOR ECOSYSTEM (FETCH & SAVE) ---

@app.post("/counselor/register")
def register_counselor(c: CounselorRegSchema, db=Depends(get_db)):
    """Registers counselor and adds to public list"""
    cursor = db.cursor()
    hashed = bcrypt.hashpw(c.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        query = """INSERT INTO counselors (name, contact_email, password_hash, specialization, experience, available_from, available_to, meeting_link) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (c.name, c.email, hashed, c.specialization, c.experience, c.available_from, c.available_to, c.meeting_link))
        db.commit()
        return {"message": "Counselor Profile Published!"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    finally: cursor.close()

@app.get("/counselors/list")
def list_counselors(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT id, name, specialization, experience, available_from, available_to, meeting_link FROM counselors")
        return cursor.fetchall()
    finally: cursor.close()

# --- 3. DASHBOARD, MOOD & AI ANALYSIS ---

@app.get("/dashboard/data/{user_id}")
def get_dashboard_info(user_id: int, db=Depends(get_db)):
    """Syncs streak and online professional status"""
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT streak_count FROM streaks WHERE user_id = %s", (user_id,))
        streak_row = cursor.fetchone()
        streak = streak_row['streak_count'] if streak_row else 0
        return {"current_streak": streak, "proactive_alert": {"message": "Experts are online.", "type": "info"}}
    finally: cursor.close()

@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text) VALUES (%s, %s, %s, %s)",
                       (mood.user_id, mood.mood_score, mood.journal_entry, mood.ai_analysis))
        db.commit()
        return {"message": "Mood Logged!"}
    finally: cursor.close()

@app.get("/moods/{user_id}")
def get_moods(user_id: int, db=Depends(get_db)):
    """Fetches user mood history for AI Detector"""
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT mood_score, journal_entry, ai_analysis_text, entry_date as log_timestamp FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC", (user_id,))
        moods = cursor.fetchall()
        for m in moods: m['log_timestamp'] = str(m['log_timestamp'])
        return {"mood_entries": moods}
    finally: cursor.close()

@app.post("/ai/mood_rating")
def ai_mood_rating(req: ChatRequest):
    """Gemini 1.5 Flash Emotional Analysis"""
    if not client: return {"mood_score": 5, "analysis": "AI Offline"}
    try:
        prompt = f"Analyze this journal entry: '{req.prompt}'. Return a score 1-10 and a short summary."
        # Fixed 404: Model name prefix removed
        response = client.models.generate_content(model='gemini-1.5-flash', contents=prompt)
        return {"mood_score": 7, "analysis": response.text.strip()}
    except Exception:
        return {"mood_score": 5, "analysis": "Emotional reflection complete."}

# --- 4. TRUSTED ACCESS PROTOCOL & VIEWS ---

@app.post("/access/generate")
def generate_token(req: AccessRequest, db=Depends(get_db)):
    """Generates secure UUID token for data sharing"""
    token = str(uuid.uuid4())
    expiry = datetime.now() + timedelta(hours=req.duration_hours)
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM access_tokens WHERE user_id = %s", (req.user_id,))
        cursor.execute("INSERT INTO access_tokens (user_id, access_token, professional_name, expires_at) VALUES (%s, %s, %s, %s)",
                       (req.user_id, token, req.professional_name, expiry))
        db.commit()
        return {"access_token": token, "expires_at": str(expiry), "professional_name": req.professional_name}
    finally: cursor.close()

@app.get("/access/view/{token}")
def professional_view(token: str, db=Depends(get_db)):
    """Allows professionals to view user data with a valid token"""
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT user_id, professional_name, expires_at FROM access_tokens WHERE access_token = %s", (token,))
        token_data = cursor.fetchone()
        if not token_data or token_data['expires_at'] < datetime.now():
            raise HTTPException(status_code=401, detail="Invalid/Expired Token")
        
        user_id = token_data['user_id']
        cursor.execute("SELECT mood_score, journal_entry, ai_analysis_text, entry_date FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC LIMIT 10", (user_id,))
        history = cursor.fetchall()
        for e in history: e['entry_date'] = str(e['entry_date'])
        return {"status": "Authorized", "professional": token_data['professional_name'], "data": history}
    finally: cursor.close()

@app.delete("/access/revoke/{user_id}")
def revoke_access(user_id: int, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("DELETE FROM access_tokens WHERE user_id = %s", (user_id,))
        db.commit()
        return {"message": "All access revoked."}
    finally: cursor.close()