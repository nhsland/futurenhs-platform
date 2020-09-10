SELECT id, 
    title,
    description
FROM workspaces
WHERE id = $1
