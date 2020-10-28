INSERT INTO workspaces (title, description, admins, members)
VALUES ($1, $2, $3, $4)
RETURNING *
