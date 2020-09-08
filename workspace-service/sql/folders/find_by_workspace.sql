SELECT id, 
    title,
    long_description,
    workspace
FROM folders
WHERE workspace = $1
