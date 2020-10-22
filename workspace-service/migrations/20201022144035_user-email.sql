-- Add migration script here
ALTER TABLE users
  ADD COLUMN email_address TEXT NOT NULL DEFAULT ('testuser@example.com');

ALTER TABLE users
  ALTER COLUMN email_address
    DROP DEFAULT;
