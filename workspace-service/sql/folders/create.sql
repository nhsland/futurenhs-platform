INSERT INTO folders (title, description, workspace)
VALUES ($1, $2, $3)
RETURNING id, title, description, workspace
