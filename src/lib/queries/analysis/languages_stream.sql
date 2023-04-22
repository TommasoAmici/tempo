SELECT "language" AS "language: String",
    DATE("time", 'unixepoch', 'weekday 0') AS "date!: Date",
    COUNT(*) AS "count: i32"
FROM heartbeats h
WHERE user_id = ?1
    AND "project" = COALESCE(?2, "project")
    AND branch = COALESCE(?3, branch)
    AND DATE("time", 'unixepoch') >= COALESCE(?4, DATE("time", 'unixepoch'))
    AND DATE("time", 'unixepoch') <= COALESCE(?5, DATE("time", 'unixepoch'))
GROUP BY "language: String",
    "date!: Date"
HAVING "count: i32" > COALESCE(?6, 20)
ORDER BY "language: String",
    "date!: Date"
