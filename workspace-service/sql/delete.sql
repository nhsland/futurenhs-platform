DELETE FROM workspace
WHERE id = $1
RETURNING id, title
