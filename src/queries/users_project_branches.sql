SELECT DISTINCT CASE
        WHEN h.branch == '' THEN 'Unknown'
        ELSE h.branch
    END AS "branch: String"
FROM heartbeats h
WHERE user_id = ?1
    AND DATE(h."time", 'unixepoch') >= COALESCE(?3, DATE(h."time", 'unixepoch'))
    AND DATE(h."time", 'unixepoch') <= COALESCE(?4, DATE(h."time", 'unixepoch'))
    AND project == ?2
GROUP BY "branch: String"
ORDER BY COUNT(*) DESC
