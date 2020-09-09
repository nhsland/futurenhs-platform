UPDATE folders
SET title = COALESCE($2, title),
    description = COALESCE($3, description)
WHERE id = $1
RETURNING id, title, description, workspace
