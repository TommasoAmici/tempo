WITH time_cte AS (
    SELECT language,
        created_at,
        time,
        CAST(time - LAG (time, 1, time) OVER (ORDER BY time) AS REAL) AS time_spent
    FROM heartbeats h
    WHERE user_id = ? AND created_at >= DATE('now', 'start of day')
    ORDER BY id
    LIMIT -1 OFFSET 1
)
SELECT language AS name,
    CAST(time_spent AS REAL) as time_spent,
    CAST(time_spent / (SELECT SUM(time_spent) FROM time_cte) AS REAL) as time_percentage
FROM (
        SELECT
            language,
            CAST(SUM(time_spent) as real) AS time_spent
        FROM time_cte
        GROUP BY language
        ORDER BY time_spent DESC
    )
