-- Add migration script here
ALTER TABLE folders
  ADD COLUMN role_required TEXT NOT NULL DEFAULT ('ALL_MEMBERS');
  