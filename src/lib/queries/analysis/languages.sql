WITH sorted_heartbeats AS (
    SELECT id,
        "language",
        "project",
        "time",
        LAG("time") OVER (
            ORDER BY "time" ASC
        ) AS prev_time
    FROM heartbeats
    WHERE user_id = ?1
        AND "project" = COALESCE(?2, "project")
        AND branch = COALESCE(?3, branch)
        AND DATE("time", 'unixepoch') >= COALESCE(?4, DATE("time", 'unixepoch'))
        AND DATE("time", 'unixepoch') <= COALESCE(?5, DATE("time", 'unixepoch'))
),
calculated_times AS (
    SELECT id,
        "language",
        "project",
        "time",
        prev_time,
        -- heartbeats are sent every few seconds, so if the time difference is bigger than 120 seconds
        -- it's probably a new session
        CASE
            WHEN "time" - "prev_time" > 90
            OR prev_time IS NULL THEN 0
            ELSE "time" - prev_time
        END AS time_diff
    FROM sorted_heartbeats
)
SELECT "language" AS "name: String",
    SUM(time_diff) AS "time_spent: f64",
    SUM(time_diff) /(
        SELECT SUM(time_diff)
        FROM calculated_times
    ) AS "time_percentage: f64"
FROM calculated_times
GROUP BY "language"
HAVING "language" != ''
ORDER BY "time_spent: f64" DESC,
    "language"
