CREATE TABLE IF NOT EXISTS users (
    id uuid DEFAULT uuid_generate_v4 (),
    auth_id uuid UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_platform_admin BOOLEAN NOT NULL,
    PRIMARY KEY (id)
);
