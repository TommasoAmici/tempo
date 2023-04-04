WITH branches_cte AS (
    SELECT strftime('%Y-%m-%d', DATE(h.time, 'unixepoch')) AS "date",
        branch
    FROM heartbeats h
    WHERE user_id = ?1
        AND branch NOT IN ('', 'main', 'master')
        AND DATE(h."time", 'unixepoch') >= COALESCE(?2, DATE(h."time", 'unixepoch'))
        AND DATE(h."time", 'unixepoch') <= COALESCE(?3, DATE(h."time", 'unixepoch'))
),
branches_query AS (
    SELECT "date" AS "date",
        "branch" AS "branch",
        COUNT(*) AS "count" -- CAST(COUNT(*) AS REAL) / CAST(SUM(COUNT(*)) OVER(PARTITION BY "date") AS REAL) AS "percent"
    FROM branches_cte
    GROUP BY "date",
        "branch"
    ORDER BY "date",
        "branch"
)
SELECT b."date" AS "date: String",
    JSON_GROUP_OBJECT(b."branch", b."count") AS "values: sqlx::types::JsonValue"
FROM branches_query b
GROUP BY b."date"
