WITH RECURSIVE past_year_dates("date") AS (
    VALUES(COALESCE(?4, DATE('now', '-1 month')))
    UNION ALL
    SELECT date("date", '+1 day', 'weekday 0')
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
    HAVING COUNT(*) > COALESCE(?6, 100)
),
all_languages_dates AS (
    SELECT p."date" AS "date",
        a."language" AS "language"
    FROM all_languages a
        CROSS JOIN past_year_dates p
),
language_stream_cte AS (
    SELECT h."language",
        DATE(h."time", 'unixepoch', 'weekday 0') AS "date",
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
SELECT a."date" AS "date",
    a."language" AS "language",
    l."count" AS "count"
FROM all_languages_dates a
    LEFT JOIN language_stream_cte l ON a."date" = l."date"
    AND a."language" = l."language"
ORDER BY "language",
    "date";
