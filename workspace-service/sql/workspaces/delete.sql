DELETE FROM workspaces
WHERE id = $1
RETURNING id, title, description
