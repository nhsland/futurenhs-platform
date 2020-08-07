INSERT INTO workspace (title)
VALUES ($1)
RETURNING id, title
