INSERT INTO workspaces (title, description)
VALUES ($1, $2)
RETURNING *
