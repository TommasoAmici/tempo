WITH RECURSIVE past_year_dates("date") AS (
    VALUES(COALESCE(?4, DATE('now', '-1 month')))
    UNION ALL
    SELECT CASE
            WHEN JULIANDAY(COALESCE(?5, DATE('now'))) - JULIANDAY(COALESCE(?4, DATE('now', '-1 year'))) > 15 THEN date("date", '+1 day', 'weekday 1')
            ELSE date("date", '+1 day')
        END AS "date"
    FROM past_year_dates
    WHERE "date" < COALESCE(?5, DATE('now'))
),
all_languages AS (
    SELECT DISTINCT h."language"
    FROM heartbeats h
    WHERE user_id = ?1
        AND h."project" = COALESCE(?2, h."project")
        AND h."branch" = COALESCE(?3, h."branch")
        AND h."language" != ''
        AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
        AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
    GROUP BY h."language"
    ORDER BY COUNT(*) DESC
    LIMIT 10
), all_languages_dates AS (
    SELECT p."date" AS "date",
        a."language" AS "language"
    FROM all_languages a
        CROSS JOIN past_year_dates p
),
language_stream_cte AS (
    SELECT h."language",
        CASE
            WHEN JULIANDAY(COALESCE(?5, DATE('now'))) - JULIANDAY(COALESCE(?4, DATE('now', '-1 year'))) > 15 THEN DATE(h."time", 'unixepoch', 'weekday 1')
            ELSE DATE(h."time", 'unixepoch')
        END AS "date",
        COUNT(*) AS "count"
    FROM heartbeats h
    WHERE user_id = ?1
        AND h."project" = COALESCE(?2, h."project")
        AND h."branch" = COALESCE(?3, h."branch")
        AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
        AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
    GROUP BY h."language",
        "date"
)
SELECT a."date" AS "date!: Date",
    a."language" AS "language",
    l."count" AS "count!: i32"
FROM all_languages_dates a
    LEFT JOIN language_stream_cte l ON a."date" = l."date"
    AND a."language" = l."language"
ORDER BY "language",
    "date: Date";
