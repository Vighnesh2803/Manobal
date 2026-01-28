# backend/main.py - Final Production Version
from fastapi import FastAPI, HTTPException, Depends
import mysql.connector
from pydantic import BaseModel, EmailStr
from contextlib import asynccontextmanager
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException, Depends
from google import genai
from typing import Optional, List
from datetime import datetime, timezone
import json
import re

# --- GLOBAL AI SETUP ---
GEMINI_API_KEY = "AIzaSyBgsC2f8RBjAKdZxpPHqYNXEJVsYwkciR8"
client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    try:
       client = genai.Client(api_key=GEMINI_API_KEY)
       print("✅ Manobal AI Ready")
    except Exception as e:
        print(f"❌ AI Init Error: {e}")
    yield

# --- APP INITIALIZATION ---
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

# --- MODELS ---
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

class ChatRequest(BaseModel):
    user_id: int
    prompt: str

class CounselorRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    specialization: str
    experience: str
    available_from: str 
    available_to: str   
    meeting_link: str

class BookingRequest(BaseModel):
    user_id: int
    counselor_id: int
    booking_date: str

# --- 1. AUTHENTICATION ---
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
    return {"user_id": user_data["id"], "username": user_data["username"]}

# --- 2. COUNSELOR & BOOKING ---
@app.post("/counselor/register")
def register_counselor(c: CounselorRegister, db=Depends(get_db)):
    cursor = db.cursor()
    hashed = bcrypt.hashpw(c.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    try:
        query = """INSERT INTO counselors (name, contact_email, password_hash, specialization, 
                   experience, available_from, available_to, meeting_link) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(query, (c.name, c.email, hashed, c.specialization, 
                               c.experience, c.available_from, c.available_to, c.meeting_link))
        db.commit()
        return {"message": "Expert Profile Created!"}
    finally: cursor.close()

@app.get("/counselors")
def list_counselors(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, name, specialization, experience, available_from, available_to, meeting_link FROM counselors")
    data = cursor.fetchall()
    for r in data:
        r['available_from'] = str(r['available_from'])
        r['available_to'] = str(r['available_to'])
    cursor.close()
    return data

@app.post("/book_session")
def book_session(req: BookingRequest, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        query = "INSERT INTO appointments (user_id, counselor_id, appointment_date) VALUES (%s, %s, %s)"
        cursor.execute(query, (req.user_id, req.counselor_id, req.booking_date))
        db.commit()
        return {"message": "Meeting Fixed! Access link on dashboard."}
    finally: cursor.close()

# --- 3. MOODS & DASHBOARD ---
@app.get("/dashboard/data/{user_id}")
def get_dashboard_data(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT streak_count FROM streaks WHERE user_id = %s", (user_id,))
        streak = cursor.fetchone()
        cursor.execute("SELECT mood_score, entry_date FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC LIMIT 7", (user_id,))
        moods = cursor.fetchall()
        return {"current_streak": streak['streak_count'] if streak else 0, "recent_moods": moods}
    finally: cursor.close()

@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text) VALUES (%s, %s, %s, %s)",
                       (mood.user_id, mood.mood_score, mood.journal_entry, mood.ai_analysis))
        db.commit()
        return {"message": "Mood added!"}
    finally: cursor.close()

# --- 4. AI CHATBOT ---
@app.post("/chat")
def chatbot(req: ChatRequest, db=Depends(get_db)):
    if not client: raise HTTPException(status_code=503, detail="AI Client offline")
    try:
        response = client.models.generate_content(model='gemini-2.0-flash', contents=req.prompt)
        cursor = db.cursor()
        cursor.execute("INSERT INTO chat_messages (user_id, user_message, ai_response) VALUES (%s, %s, %s)",
                       (req.user_id, req.prompt, response.text))
        db.commit()
        cursor.close()
        return {"message": response.text}
    except Exception as e:
        return {"message": f"AI service busy: {str(e)}"}