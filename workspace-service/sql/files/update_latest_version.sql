UPDATE files
SET latest_version = $3
WHERE id = $1 AND latest_version = $2
RETURNING *
