CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password_hash TEXT NOT NULL,
    email TEXT NOT NULL,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    UNIQUE (email)
);
CREATE TABLE IF NOT EXISTS heartbeats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INT NOT NULL,
    branch TEXT NOT NULL,
    category TEXT NOT NULL,
    cursorpos INT,
    dependencies JSON NOT NULL,
    entity TEXT NOT NULL,
    is_write BOOL NOT NULL,
    language TEXT NOT NULL,
    lineno INT,
    lines INT NOT NULL,
    project TEXT NOT NULL,
    project_root_count INT NOT NULL,
    time REAL NOT NULL,
    type TEXT NOT NULL,
    operating_system TEXT NOT NULL,
    machine TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
