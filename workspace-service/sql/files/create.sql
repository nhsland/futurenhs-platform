INSERT INTO files (created_by, created_at, latest_version)
VALUES ($1, NOW(), $2) 
RETURNING *
