DELETE FROM workspaces
WHERE id = $1
RETURNING id, title, long_description
