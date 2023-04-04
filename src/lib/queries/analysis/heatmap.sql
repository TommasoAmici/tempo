WITH RECURSIVE past_year_dates("date", "week", "day_of_week") AS (
    VALUES(
            DATE('now', '-1 year'),
            strftime('%W', date('now', '-1 year')),
            strftime('%w', date('now', '-1 year'))
        )
    UNION ALL
    SELECT date("date", '+1 day'),
        strftime('%W', date("date", '+1 day')),
        strftime('%w', DATE("date", '+1 day'))
    FROM past_year_dates
    WHERE "date" < DATE('now')
),
heartbeats_cte AS (
    SELECT strftime('%W', DATE(h.time, 'unixepoch')) AS "week",
        strftime('%w', DATE(h.time, 'unixepoch')) AS "day_of_week",
        strftime('%Y-%m-%d', DATE(h.time, 'unixepoch')) AS "date",
        count(*) as "count"
    FROM heartbeats h
    WHERE user_id = ?1
        AND "date" > DATE('now', '-1 year')
    GROUP BY "date"
)
SELECT p."week" AS "week: u8",
    p."day_of_week" AS "day_of_week: u8",
    p."date" AS "date: String",
    CASE
        WHEN h."count" IS NULL THEN 0
        ELSE h."count"
    END AS "count"
FROM past_year_dates p
    LEFT JOIN heartbeats_cte h ON p."date" = h."date"
ORDER BY p."date"
