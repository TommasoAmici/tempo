WITH RECURSIVE past_year_dates("date") AS (
    VALUES(COALESCE(?4, DATE('now', '-1 year')))
    UNION ALL
    SELECT date("date", '+1 day', 'weekday 0')
    FROM past_year_dates
    WHERE "date" < COALESCE(?5, DATE('now'))
),
all_languages AS (
    SELECT DISTINCT h."language"
    FROM heartbeats h
    WHERE user_id = ?1
        AND "project" = COALESCE(?2, "project")
        AND branch = COALESCE(?3, branch)
        AND DATE("time", 'unixepoch') >= COALESCE(?4, DATE("time", 'unixepoch'))
        AND DATE("time", 'unixepoch') <= COALESCE(?5, DATE("time", 'unixepoch'))
    GROUP BY "language",
        "date"
    HAVING "count" > COALESCE(?6, 20)
),
all_languages_dates AS (
    SELECT p."date" AS "date",
        a."language" AS "language"
    FROM all_languages a
        CROSS JOIN past_year_dates p
),
language_stream_cte AS (
    SELECT "language",
        DATE("time", 'unixepoch', 'weekday 0') AS "date",
        COUNT(*) AS "count"
    FROM heartbeats h
    WHERE user_id = ?1
        AND "project" = COALESCE(?2, "project")
        AND branch = COALESCE(?3, branch)
        AND DATE("time", 'unixepoch') >= COALESCE(?4, DATE("time", 'unixepoch'))
        AND DATE("time", 'unixepoch') <= COALESCE(?5, DATE("time", 'unixepoch'))
    GROUP BY "language",
        "date"
    HAVING "count" > COALESCE(?6, 20)
)
SELECT a."date" AS "date!: Date",
    a."language" AS "language: String",
    l."count" AS "count: i32"
FROM all_languages_dates a
    LEFT JOIN language_stream_cte l ON a."date" = l."date"
    AND a."language" = l."language"
ORDER BY "language: String",
    "date!: Date";
