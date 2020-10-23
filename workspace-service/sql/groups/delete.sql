DELETE FROM groups
WHERE id = $1
RETURNING id, title
