SELECT
    id,
    password_hash,
    email,
    token,
    created_at
FROM users
WHERE token = ?1 LIMIT 1
