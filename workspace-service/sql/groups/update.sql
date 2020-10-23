UPDATE groups
SET title = COALESCE($2, title)
WHERE id = $1
RETURNING id, title
