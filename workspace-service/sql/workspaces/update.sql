UPDATE workspaces
SET title = COALESCE($2, title),
    long_description = COALESCE($3, long_description)
WHERE id = $1
RETURNING id, title, long_description
