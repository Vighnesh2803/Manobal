-- =============================================
-- 🛡️ MANOBAL DATABASE: FINAL AUTHORITATIVE SYNC
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;

-- Purani tables ko drop karein taaki schema fresh ho jaye
DROP TABLE IF EXISTS access_tokens;
DROP TABLE IF EXISTS streaks;
DROP TABLE IF EXISTS mood_entries;
DROP TABLE IF EXISTS counselors;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS: Client identity storage
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. COUNSELORS: Exact match for CounselorReg.jsx & main.py
CREATE TABLE counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,  -- 🔥 Fixed: Matches 'email' in backend
    password VARCHAR(255) NOT NULL,      -- 🔥 Fixed: Matches 'password' in backend
    specialization VARCHAR(255) DEFAULT 'Mental Health Expert',
    experience VARCHAR(100) DEFAULT 'Professional',
    available_from VARCHAR(50),
    available_to VARCHAR(50),
    meeting_link VARCHAR(500),
    image_url VARCHAR(500) NULL
);

-- 3. MOOD ENTRIES: Neural log history
CREATE TABLE mood_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_score INT NOT NULL,
    journal_entry TEXT,
    ai_analysis_text TEXT NULL,
    entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. STREAKS: Dashboard sync logic
CREATE TABLE streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    streak_count INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. ACCESS TOKENS: Professional sharing node
CREATE TABLE access_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    access_token VARCHAR(50) UNIQUE NOT NULL,
    professional_name VARCHAR(100),
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

