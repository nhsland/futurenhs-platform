CREATE TABLE IF NOT EXISTS groups (
  id uuid DEFAULT uuid_generate_v4 (),
  name TEXT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS group_workspace_grants (
  is_admin BOOLEAN NOT NULL,
  group_id uuid NOT NULL REFERENCES groups,
  workspace_id uuid NOT NULL REFERENCES workspaces,
  CONSTRAINT group_workspace_grant PRIMARY KEY (is_admin, group_id, workspace_id)
);

CREATE TABLE IF NOT EXISTS user_groups (
  user_id uuid NOT NULL REFERENCES users,
  group_id uuid NOT NULL REFERENCES groups,
  CONSTRAINT user_group PRIMARY KEY (user_id, group_id)
);
