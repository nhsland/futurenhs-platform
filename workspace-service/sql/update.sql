UPDATE workspace
SET title = COALESCE($1, title)
WHERE id = $2
RETURNING id, title
