-- this down migration script alters the column project_root_count in the table heartbeats to not allow null values
ALTER TABLE heartbeats
  RENAME TO heartbeats_old;
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
INSERT INTO heartbeats(
    id,
    user_id,
    branch,
    category,
    cursorpos,
    dependencies,
    entity,
    is_write,
    language,
    lineno,
    lines,
    project,
    project_root_count,
    time,
    type,
    operating_system,
    machine,
    user_agent,
    created_at
  )
SELECT id,
  user_id,
  branch,
  category,
  cursorpos,
  dependencies,
  entity,
  is_write,
  language,
  lineno,
  lines,
  project,
  CASE
    WHEN project_root_count IS NULL THEN -1
    ELSE project_root_count
  END as project_root_count,
  time,
  type,
  operating_system,
  machine,
  user_agent,
  created_at
FROM heartbeats_old;
DROP TABLE heartbeats_old;
