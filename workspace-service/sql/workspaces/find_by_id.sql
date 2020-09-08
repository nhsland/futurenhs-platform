SELECT id, 
    title,
    long_description
FROM workspaces
WHERE id = $1
