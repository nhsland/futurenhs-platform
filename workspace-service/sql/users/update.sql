UPDATE users
SET is_platform_admin = $2
WHERE auth_id = $1
RETURNING *
