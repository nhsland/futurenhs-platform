INSERT INTO groups (title)
VALUES ($1)
RETURNING id, title
