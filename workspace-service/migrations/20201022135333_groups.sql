CREATE TABLE IF NOT EXISTS groups (
  id uuid DEFAULT uuid_generate_v4 (),
  title TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS user_groups (
  user_id uuid NOT NULL REFERENCES users,
  group_id uuid NOT NULL REFERENCES groups,
  CONSTRAINT user_group PRIMARY KEY (user_id, group_id)
);

ALTER TABLE workspaces ADD COLUMN members uuid REFERENCES groups;

ALTER TABLE workspaces ADD COLUMN admins uuid REFERENCES groups;
