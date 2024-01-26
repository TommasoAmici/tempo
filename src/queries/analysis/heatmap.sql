WITH RECURSIVE past_year_dates("date") AS (
    VALUES(COALESCE(?4, DATE('now', '-1 year')))
    UNION ALL
    SELECT date("date", '+1 day')
    FROM past_year_dates
    WHERE "date" < COALESCE(?5, DATE('now'))
),
heatmap_cte AS (
    SELECT strftime('%Y-%m-%d', DATE(h.time, 'unixepoch')) AS "date",
        COUNT(*) as "value"
    FROM heartbeats h
    WHERE user_id = ?1
        AND project = COALESCE(?2, project)
        AND branch = COALESCE(?3, branch)
        AND "date" > DATE('now', '-1 year')
        AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
        AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
    GROUP BY "date"
)
SELECT p."date" AS "date: Date",
    "value" AS "value: i32"
FROM heatmap_cte h
    RIGHT JOIN past_year_dates p ON h."date" = p."date"
ORDER BY p."date"
