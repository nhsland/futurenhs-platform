SELECT id, 
    title,
    long_description
FROM workspace
WHERE id = $1
