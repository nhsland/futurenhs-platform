INSERT INTO teams (title)
VALUES ($1)
RETURNING id, title
