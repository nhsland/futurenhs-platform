SELECT id, 
    title,
    description,
    workspace
FROM folders
WHERE id = $1
