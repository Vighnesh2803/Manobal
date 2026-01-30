-- 1. Foreign Key checks ko temporarily disable karein taaki DROP TABLE error na aaye
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Purana data clean karein
DROP TABLE IF EXISTS appointments; 
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS access_tokens; 
DROP TABLE IF EXISTS streaks;
DROP TABLE IF EXISTS mood_entries;
DROP TABLE IF EXISTS counselors;
DROP TABLE IF EXISTS users;

-- Foreign Key checks ko wapas on karein
SET FOREIGN_KEY_CHECKS = 1;

-- 3. Users Table 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Mood Entries (Fixes AIDetector and Chart visualization)
CREATE TABLE mood_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    mood_score INT NOT NULL,
    journal_entry TEXT,
    ai_analysis_text TEXT NULL, 
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Streaks (Fixes Dashboard Sync)
CREATE TABLE streaks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE, 
    streak_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Counselors Table (Fixes 'available_from' missing column error)
CREATE TABLE counselors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    specialization VARCHAR(255) DEFAULT 'Mental Health Expert',
    experience VARCHAR(100) DEFAULT 'Professional',
    available_from VARCHAR(50), -- VARCHAR used for easy modal data sync
    available_to VARCHAR(50),
    meeting_link VARCHAR(500),
    image_url VARCHAR(500) NULL
);

-- 7. Chat Messages (Fixes Chatbot Save Error)
CREATE TABLE chat_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message_text TEXT NOT NULL,
    sender_type ENUM('user', 'bot') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. Trusted Access Tokens
CREATE TABLE access_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    access_token VARCHAR(255) UNIQUE NOT NULL,
    professional_name VARCHAR(100),
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Appointments
CREATE TABLE appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    counselor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (counselor_id) REFERENCES counselors(id) ON DELETE CASCADE
);