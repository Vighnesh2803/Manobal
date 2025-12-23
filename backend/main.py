# file: main.py (FINAL PRODUCTION VERSION - SYNCED & ROBUST)

from fastapi import FastAPI, HTTPException, Depends
import mysql.connector
from pydantic import BaseModel
from contextlib import asynccontextmanager
import bcrypt
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from google import genai
from google.genai import types
from typing import Optional
from dotenv import load_dotenv
import secrets
from datetime import datetime, timedelta, timezone
import os 
import json 
import re

# Type alias for clarity
MySQLConnection = mysql.connector.connection.MySQLConnection

# --- GLOBAL AI CLIENT SETUP ---
GEMINI_API_KEY = "AIzaSyA90rjfhLfCV2VDxyAipchT1FJDk_LtTEw"
client = None 

@asynccontextmanager
async def lifespan(app: FastAPI):
    global client
    try:
        client = genai.Client(api_key=GEMINI_API_KEY) 
        print("Gemini Client initialized successfully.")
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
        client = None 
    yield 

def create_app() -> FastAPI:
    app = FastAPI(lifespan=lifespan)

    db_config = {
        "host": "127.0.0.1",
        "user": "root",
        "password": "vig2006", 
        "database": "suicide_awareness_db"
    }
    
    def get_db_connection():
        conn = None
        try:
            conn = mysql.connector.connect(**db_config)
            yield conn
        except mysql.connector.Error as err:
            raise HTTPException(status_code=500, detail=f"Database connection error: {err}")
        finally:
            if conn: conn.close()

    # --- Pydantic Models ---
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

    class AIMoodAnalysisRequest(BaseModel):
        journal_entry: str

    class AIMoodAnalysisResponse(BaseModel):
        mood_score: int
        analysis: str
        message: str = "AI mood analysis successful."

    class ChatRequest(BaseModel):
        user_id: int
        prompt: str

    class StreakUpdate(BaseModel):
        user_id: int

    class GenerateAccessTokenRequest(BaseModel):
        user_id: int
        professional_name: str
        duration_hours: int = 48 

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # --- Authentication ---
    @app.post("/register")
    def register_user(user: UserCreate, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor()
        hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        try:
            cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", 
                           (user.username, user.email, hashed))
            conn.commit()
            return {"message": "User registered!"}
        except mysql.connector.Error as err:
            raise HTTPException(status_code=400, detail=str(err))
        finally: cursor.close()

    @app.post("/login")
    def login_user(user: UserLogin, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, username, password_hash FROM users WHERE username = %s", (user.username,))
        user_data = cursor.fetchone()
        cursor.close()
        if not user_data or not bcrypt.checkpw(user.password.encode('utf-8'), user_data['password_hash'].encode('utf-8')):
            raise HTTPException(status_code=400, detail="Invalid username or password")
        return {"user_id": user_data["id"], "username": user_data["username"]}

    # --- Dashboard Data ---
    @app.get("/dashboard/data/{user_id}")
    def get_dashboard_data(user_id: int, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT streak_count FROM streaks WHERE user_id = %s", (user_id,))
            streak_data = cursor.fetchone()
            # FIXED: Alias entry_date as log_timestamp for dashboard trends
            cursor.execute("SELECT mood_score, entry_date as log_timestamp FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC LIMIT 7", (user_id,))
            recent_moods = cursor.fetchall()
            return {
                "current_streak": streak_data['streak_count'] if streak_data else 0,
                "recent_moods": recent_moods,
                "proactive_alert": None 
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
        finally: cursor.close()

    # --- Mood Logs ---
    @app.get("/moods/{user_id}")
    def get_user_moods(user_id: int, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor(dictionary=True)
        try:
            # FIXED: Alias 'id' to 'entry_id'
            query = "SELECT id as entry_id, mood_score, journal_entry, entry_date as log_timestamp, ai_analysis_text FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC"
            cursor.execute(query, (user_id,))
            return {"mood_entries": cursor.fetchall()}
        finally: cursor.close()

    @app.post("/moods")
    def add_mood_entry(mood: MoodEntry, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor()
        try:
            query = "INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text) VALUES (%s, %s, %s, %s)"
            cursor.execute(query, (mood.user_id, mood.mood_score, mood.journal_entry, mood.ai_analysis))
            conn.commit()
            return {"message": "Mood entry added successfully!"}
        finally: cursor.close()

    # --- AI Chatbot Endpoint (NEW FIX) ---
    @app.post("/chat")
    def chat_with_ai(request: ChatRequest, conn: MySQLConnection = Depends(get_db_connection)):
        # Resolves the 404 connection error in chatbot page
        if not client: raise HTTPException(status_code=503, detail="AI service unavailable.")
        try:
            response = client.models.generate_content(model='gemini-2.0-flash', contents=request.prompt)
            return {"message": response.text}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

    # --- AI Mood Analysis with Fallback ---
    @app.post("/ai/mood_rating", response_model=AIMoodAnalysisResponse)
    async def ai_mood_rating(request: AIMoodAnalysisRequest):
        # Fallback score if quota is hit
        fallback = AIMoodAnalysisResponse(mood_score=5, analysis="Quota reached. Score set to neutral.", message="Fallback Success")
        if not client: return fallback
        
        prompt = f"Analyze mood from: '{request.journal_entry}'. Return valid JSON: {{'mood_score': 1-10, 'analysis': 'string'}}"
        try:
            response = client.models.generate_content(model='gemini-2.0-flash', contents=prompt)
            match = re.search(r"\{.*\}", response.text, re.DOTALL)
            if match:
                data = json.loads(match.group())
                return AIMoodAnalysisResponse(mood_score=data.get('mood_score', 5), analysis=data.get('analysis', "Success"), message="AI Success")
            return fallback
        except Exception as e:
            print(f"Gemini API Quota Error: {e}")
            return fallback

    # --- Streak Update ---
    @app.post("/streaks/update")
    def update_streak(streak_update: StreakUpdate, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT streak_count, last_updated FROM streaks WHERE user_id = %s", (streak_update.user_id,))
            result = cursor.fetchone()
            now_utc = datetime.now(timezone.utc)
            if result:
                last_upd = result['last_updated'].replace(tzinfo=timezone.utc)
                if last_upd.date() < now_utc.date():
                    new_count = result['streak_count'] + 1
                    cursor.execute("UPDATE streaks SET streak_count = %s, last_updated = NOW() WHERE user_id = %s", (new_count, streak_update.user_id))
                    conn.commit()
                    return {"streak_count": new_count}
                return {"streak_count": result['streak_count']}
            else:
                cursor.execute("INSERT INTO streaks (user_id, streak_count, last_updated) VALUES (%s, 1, NOW())", (streak_update.user_id,))
                conn.commit()
                return {"streak_count": 1}
        finally: cursor.close()

    # --- Trusted Access ---
    @app.post("/access/generate")
    async def generate_access_token(request: GenerateAccessTokenRequest, conn: MySQLConnection = Depends(get_db_connection)):
        expiry = datetime.now(timezone.utc) + timedelta(hours=request.duration_hours)
        token = secrets.token_urlsafe(48)
        cursor = conn.cursor()
        try:
            cursor.execute("DELETE FROM trusted_access WHERE user_id = %s", (request.user_id,))
            cursor.execute("INSERT INTO trusted_access (user_id, professional_name, access_token, expiry_timestamp) VALUES (%s, %s, %s, %s)",
                           (request.user_id, request.professional_name, token, expiry))
            conn.commit()
            return {"access_token": token, "expires_at": expiry}
        finally: cursor.close()

    @app.get("/access/view_data/{access_token}")
    async def view_shared_data(access_token: str, conn: MySQLConnection = Depends(get_db_connection)):
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT user_id, professional_name, expiry_timestamp FROM trusted_access WHERE access_token = %s", (access_token,))
            token_info = cursor.fetchone()
            if not token_info: raise HTTPException(status_code=404, detail="Invalid token.")

            # FIXED: Timezone aware comparison
            expiry = token_info['expiry_timestamp']
            if expiry.tzinfo is None: expiry = expiry.replace(tzinfo=timezone.utc)
            if expiry < datetime.now(timezone.utc): raise HTTPException(status_code=401, detail="Token expired.")

            cursor.execute("SELECT mood_score, entry_date as log_timestamp FROM mood_entries WHERE user_id = %s ORDER BY entry_date DESC LIMIT 30", (token_info['user_id'],))
            return {"professional_name": token_info['professional_name'], "user_data_trends": cursor.fetchall()}
        finally: cursor.close()

    return app

app = create_app()                                                                                