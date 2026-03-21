import os
import bcrypt
import mysql.connector
import re  
import uuid
from datetime import datetime, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from google import genai


# ENV & GEMINI SETUP

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


# DB CONFIG

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

#  MODELS & SCHEMAS

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

class CounselorCreate(BaseModel):
    name: str
    email: str
    password: str
    specialization: str
    experience: str
    available_from: str
    available_to: str
    meeting_link: str

class AccessRequest(BaseModel):
    user_id: int
    professional_name: str
    duration_hours: int


#  AUTHENTICATION 

@app.post("/register")
def register(user: UserCreate, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        hashed = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
        cursor.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)", 
                       (user.username, user.email, hashed))
        db.commit()
        return {"status": "success", "message": "Registered"}
    except Exception as e:
        db.rollback()
        raise HTTPException(400, detail="User already exists or DB error")
    finally: cursor.close()

@app.post("/login")
def login(user: UserLogin, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT id, username, password_hash FROM users WHERE username=%s", (user.username,))
    data = cursor.fetchone()
    cursor.close()
    if data and bcrypt.checkpw(user.password.encode(), data["password_hash"].encode()):
        return {"status": "success", "user_id": data["id"], "username": data["username"]}
    raise HTTPException(401, "Invalid login credentials")


#  MOODS, STREAKS & DASHBOARD

@app.post("/moods")
def add_mood(mood: MoodEntry, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        cursor.execute("""
            INSERT INTO mood_entries (user_id, mood_score, journal_entry, ai_analysis_text)
            VALUES (%s, %s, %s, %s)
        """, (mood.user_id, mood.mood_score, mood.journal_entry, mood.ai_analysis))
        
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

@app.get("/moods/{user_id}")
def get_moods(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT mood_score, journal_entry, ai_analysis_text, entry_date FROM mood_entries WHERE user_id=%s ORDER BY entry_date DESC", (user_id,))
    data = cursor.fetchall()
    cursor.close()
    return {"mood_entries": data}

@app.get("/dashboard/data/{user_id}")
def dashboard_data(user_id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT streak_count FROM streaks WHERE user_id=%s", (user_id,))
    row = cursor.fetchone()
    cursor.close()
    return {"current_streak": row["streak_count"] if row else 0}


#  AI FEATURES
@app.post("/ai/mood_rating")
def get_ai_rating(req: ChatRequest):
    try:
        ai_prompt = (
            f"Analyze this mental health journal entry: '{req.prompt}'. "
            f"Provide a mood score (1-10) and a short supportive feedback sentence. "
            f"Format: Score: [number], Feedback: [text]"
        )
        response = client.models.generate_content(model="gemini-flash-latest", contents=ai_prompt)
        full_text = response.text if response.text else "Reflection complete."
        score_match = re.search(r"Score:\s*(\d+)", full_text)
        mood_score = int(score_match.group(1)) if score_match else 6
        analysis_feedback = full_text.split("Feedback:")[-1].strip() if "Feedback:" in full_text else full_text
        return {"mood_score": mood_score, "analysis": analysis_feedback}
    except Exception:
        return {"mood_score": 5, "analysis": "Neural link busy."}

@app.post("/chatbot")
def chatbot(req: ChatRequest):
    try:
        response = client.models.generate_content(model="gemini-flash-latest", contents=req.prompt)
        return {"response": response.text}
    except Exception:
        return {"response": "I am listening closely."}

#  COUNSELORS

@app.post("/counselor/register")
def register_counselor(counselor: CounselorCreate, db=Depends(get_db)):
    cursor = db.cursor()
    try:
        
        hashed = bcrypt.hashpw(counselor.password.encode(), bcrypt.gensalt()).decode()
        
        
        query = """
            INSERT INTO counselors 
            (name, email, password, specialization, experience, available_from, available_to, meeting_link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        params = (
            counselor.name, 
            counselor.email, 
            hashed, 
            counselor.specialization, 
            counselor.experience, 
            counselor.available_from, 
            counselor.available_to, 
            counselor.meeting_link
        )
        
        cursor.execute(query, params)
        db.commit()
        return {"status": "success"}
    except Exception as e:
        db.rollback()
        
        raise HTTPException(400, detail=str(e))
    finally: 
        cursor.close()
        
@app.get("/counselors/list")
def get_counselors(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT name, specialization, experience, meeting_link FROM counselors")
    data = cursor.fetchall()
    cursor.close()
    return data


# TRUSTED ACCESS: GENERATE TOKEN (Fixed 422 Error)

@app.post("/access/generate")
def generate_access_token(req: AccessRequest, db=Depends(get_db)): 
    cursor = db.cursor()
    try:
        # 1. Unique 8-character token generate karna
        new_token = str(uuid.uuid4())[:8].upper() 
        
        # 2. User ki pasand ke hours ke hisab se expiry set karna
        expiry_date = datetime.now() + timedelta(hours=req.duration_hours)
        
       
        query = """
            INSERT INTO access_tokens (user_id, access_token, professional_name, expires_at)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (req.user_id, new_token, req.professional_name, expiry_date))
        db.commit()
        
        return {
            "status": "success",
            "access_token": new_token, 
            "expires_at": expiry_date.strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(400, detail=str(e))
    finally:
        cursor.close()

#  NEW: REVOKE ACCESS

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

@app.get("/access/view/{token}")
def view_access(token: str, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    # Token ko case-insensitive banane ke liye UPPER ka use
    cursor.execute("SELECT user_id, expires_at FROM access_tokens WHERE UPPER(access_token)=UPPER(%s)", (token,))
    row = cursor.fetchone()
    
    if not row:
        raise HTTPException(404, "Token not found in database")
        
    if row["expires_at"] < datetime.now():
        raise HTTPException(403, "Token has expired")
    
    # Mood history fetch karna
    cursor.execute("""
        SELECT mood_score, journal_entry, entry_date 
        FROM mood_entries 
        WHERE user_id=%s 
        ORDER BY entry_date DESC
    """, (row["user_id"],))
    
    data = cursor.fetchall()
    cursor.close()
    return {"user_data_trends": data}