-- ===============================
-- MANOBAL DATABASE FINAL SYNC
-- ===============================
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS access_tokens;
DROP TABLE IF EXISTS streaks;
DROP TABLE IF EXISTS mood_entries;
DROP TABLE IF EXISTS counselors;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. MOOD ENTRIES
CREATE TABLE mood_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_score INT NOT NULL,
    journal_entry TEXT,
    ai_analysis_text TEXT NULL,
    entry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. STREAKS (Logic for Dashboard Sync)
CREATE TABLE streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    streak_count INT DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. COUNSELORS (Column name synced with CounselorReg.jsx)
CREATE TABLE counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE, -- Synced from 'contact_email' to 'email'
    password_hash VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) DEFAULT 'Mental Health Expert',
    experience VARCHAR(100) DEFAULT 'Professional',
    available_from VARCHAR(50),
    available_to VARCHAR(50),
    meeting_link VARCHAR(500),
    image_url VARCHAR(500) NULL
);

-- 5. TRUSTED ACCESS TOKENS
CREATE TABLE access_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    access_token VARCHAR(50) UNIQUE NOT NULL,
    professional_name VARCHAR(100),
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

