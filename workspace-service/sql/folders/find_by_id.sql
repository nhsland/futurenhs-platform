SELECT id, 
    title,
    long_description,
    workspace
FROM folders
WHERE id = $1
