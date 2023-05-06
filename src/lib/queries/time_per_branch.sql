WITH time_cte AS (
    SELECT branch,
        created_at,
        time,
        CAST(
            time - LAG (time, 1, time) OVER (
                ORDER BY time
            ) AS REAL
        ) AS time_spent
    FROM heartbeats h
    WHERE user_id = ?1
        AND created_at >= DATE('now', 'start of day')
    ORDER BY id
    LIMIT -1 OFFSET 1
)
SELECT branch as name,
    CAST(time_spent AS REAL) AS "time_spent: f64",
    CAST(
        time_spent / (
            SELECT SUM(time_spent)
            FROM time_cte
        ) AS REAL
    ) AS "time_percentage: f64"
FROM (
        SELECT branch,
            cast(SUM(time_spent) as real) AS time_spent
        FROM time_cte
        GROUP BY branch
        ORDER BY time_spent DESC
    )
