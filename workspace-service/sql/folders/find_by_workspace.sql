SELECT id,
    title,
    description,
    workspace
FROM folders
WHERE workspace = $1
ORDER BY title
