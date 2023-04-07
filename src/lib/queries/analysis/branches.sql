WITH RECURSIVE past_year_dates("date") AS (
    VALUES(COALESCE(?3, DATE('now', '-1 year')))
    UNION ALL
    SELECT date("date", '+1 day')
    FROM past_year_dates
    WHERE "date" < COALESCE(?4, DATE('now'))
),
branches_cte AS (
    SELECT strftime('%Y-%m-%d', DATE(h.time, 'unixepoch')) AS "date",
        branch
    FROM heartbeats h
    WHERE user_id = ?1
        AND project = COALESCE(?2, project)
        AND branch NOT IN ('', 'main', 'master')
        AND DATE(h."time", 'unixepoch') >= COALESCE(?3, DATE(h."time", 'unixepoch'))
        AND DATE(h."time", 'unixepoch') <= COALESCE(?4, DATE(h."time", 'unixepoch'))
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
SELECT p."date" AS "date: String",
    CASE
        WHEN b."count" IS NOT NULL THEN JSON_GROUP_OBJECT(b."branch", b."count")
        ELSE NULL
    END AS "values: sqlx::types::JsonValue"
FROM past_year_dates p
    LEFT JOIN branches_query b ON p."date" = b."date"
GROUP BY p."date"
