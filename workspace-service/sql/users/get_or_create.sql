INSERT INTO users (auth_id, name, email_address, is_platform_admin)
VALUES ($1, $2, $3, FALSE)
ON CONFLICT (auth_id) DO UPDATE
-- Noop; sql syntax to allow return without use of Option type
    SET name = users.name
RETURNING *;
