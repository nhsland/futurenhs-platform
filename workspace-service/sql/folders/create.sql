INSERT INTO folders (title, long_description, workspace)
VALUES ($1, $2, $3)
RETURNING id, title, long_description, workspace
