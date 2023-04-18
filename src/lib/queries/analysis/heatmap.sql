SELECT strftime('%Y-%m-%d', DATE(h.time, 'unixepoch')) AS "day: String",
    count(*) as "value: i32"
FROM heartbeats h
WHERE user_id = ?1
    AND project = COALESCE(?2, project)
    AND branch = COALESCE(?3, branch)
    AND "date" > DATE('now', '-1 year')
    AND DATE(h."time", 'unixepoch') >= COALESCE(?4, DATE(h."time", 'unixepoch'))
    AND DATE(h."time", 'unixepoch') <= COALESCE(?5, DATE(h."time", 'unixepoch'))
GROUP BY "day: String"
