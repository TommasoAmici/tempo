SELECT DISTINCT h.project
FROM heartbeats h
WHERE user_id = ?1
    AND DATE(h."time", 'unixepoch') >= COALESCE(?2, DATE(h."time", 'unixepoch'))
    AND DATE(h."time", 'unixepoch') <= COALESCE(?3, DATE(h."time", 'unixepoch'))
    AND project != ''
GROUP BY h.project
ORDER BY COUNT(*) DESC
