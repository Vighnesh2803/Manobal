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
    ai_analysis: str = None 

class AccessRequest(BaseModel):
    user_id: int
    professional_name: str
    duration_hours: int

# =========================
# 🔥 AI FEATURES (Mood Rating)
# =========================
@app.post("/ai/mood_rating")
def get_ai_rating(req: ChatRequest):
    try:
        ai_prompt = (
            f"Analyze this mental health journal entry: '{req.prompt}'. "
            f"Provide a mood score (1-10) and a short supportive feedback sentence. "
            f"Format: Score: [number], Feedback: [text]"
        )
        response = client.models.generate_content(model="gemini-1.5-flash", contents=ai_prompt)
        full_text = response.text if response.text else "Reflection complete."
        score_match = re.search(r"Score:\s*(\d+)", full_text)
        mood_score = int(score_match.group(1)) if score_match else 6
        analysis_feedback = full_text.split("Feedback:")[-1].strip() if "Feedback:" in full_text else full_text
        return {"mood_score": mood_score, "analysis": analysis_feedback}
    except Exception:
        # Fallback for Rating Failures
        return {"mood_score": 5, "analysis": "Neural link busy. Your reflection is still valid. Save manually."}

# =========================
# 🤖 CHATBOT (AI + Rule-Based Fallback)
# =========================
@app.post("/chatbot")
def chatbot(req: ChatRequest):
    try:
        response = client.models.generate_content(model="gemini-1.5-flash", contents=req.prompt)
        if response.text:
            return {"response": response.text}
    except Exception as e:
        print(f"⚠️ AI Limit Reached: {e}")
        user_query = req.prompt.lower()
        # Rule-based fallback for Demo safety
        if "hello" in user_query or "hi" in user_query:
            return {"response": "Hello! I am Manobal. How are you feeling today?"}
        elif "sad" in user_query or "depressed" in user_query:
            return {"response": "I'm sorry you're feeling this way. Remember, I'm here for you. Have you tried the Zen Breathing exercise?"}
        elif "help" in user_query:
            return {"response": "I can help you log your mood or you can connect with our Elite Experts."}
        return {"response": "I am listening closely. My neural link is at capacity, but your well-being is my priority. Please continue."}

# =========================
# 🔥 MOOD + STREAK (Resilient Save)
# =========================
@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        final_analysis = mood.ai_analysis
        if not final_analysis:
            try:
                res = client.models.generate_content(model="gemini-1.5-flash", contents=f"Summarize in 10 words: {mood.journal_entry}")
                final_analysis = res.text
            except:
                final_analysis = "Self-Reflective Entry (Manual Save)"

        cursor.execute("""
            INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text)
            VALUES (%s, %s, %s, %s)
        """, (mood.user_id, mood.mood_score, mood.journal_entry, final_analysis))

        # Streak Logic Fix (DATEDIFF handles synchronization)
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
        return {"message": "Success"}
    except Exception as e:
        db.rollback()
        return {"error": str(e)}
    finally: cursor.close()

# =========================
# 📊 TRUSTED ACCESS (Graph & Entries Sync)
# =========================
@app.get("/access/view/{token}")
def view_access(token: str, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT user_id, expires_at FROM access_tokens WHERE access_token=%s", (token,))
    row = cursor.fetchone()
    
    if not row or row["expires_at"] < datetime.now():
        raise HTTPException(404, "Invalid or expired token")
    
    # Fetching mood history for Moodgraphy and list
    cursor.execute("""
        SELECT mood_score, journal_entry, entry_date 
        FROM mood_entries 
        WHERE user_id=%s 
        ORDER BY entry_date DESC
    """, (row["user_id"],))
    
    data = cursor.fetchall()
    cursor.close()
    return {"user_data_trends": data}

# =========================
# 🔥 NEW: REVOKE ACCESS
# =========================
@app.post("/access/revoke/{user_id}")
def revoke_access(user_id: int, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        # User ke saare active tokens ko delete kar dega
        cursor.execute("DELETE FROM access_tokens WHERE user_id = %s", (user_id,))
        db.commit()
        return {"message": "All access tokens revoked successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(500, detail=str(e))
    finally:
        cursor.close()

# =========================
# DASHBOARD & AUTH
# =========================
@app.get("/dashboard/data/{user_id}")
def dashboard(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT streak_count FROM streaks WHERE user_id=%s", (user_id,))
    row = cursor.fetchone()
    cursor.close()
    return {"current_streak": row["streak_count"] if row else 0}

@app.get("/moods/{user_id}")
def moods(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT mood_score, journal_entry, ai_analysis_text, entry_date FROM mood_entries WHERE user_id=%s ORDER BY entry_date DESC", (user_id,))
    data = cursor.fetchall()
    cursor.close()
    return {"mood_entries": data}

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

@app.post("/access/generate")
def generate_access(req: AccessRequest, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        token = str(uuid.uuid4())[:8].upper()
        expiry = datetime.now() + timedelta(hours=req.duration_hours)
        cursor.execute("INSERT INTO access_tokens (user_id, access_token, professional_name, expires_at) VALUES (%s,%s,%s,%s)", (req.user_id, token, req.professional_name, expiry))
        db.commit()
        return {"access_token": token, "expires_at": expiry}
    finally: cursor.close()

@app.get("/counselors/list")
def counselors_list(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT name, specialization, experience, meeting_link FROM counselors")
    data = cursor.fetchall()
    cursor.close() 
    return data