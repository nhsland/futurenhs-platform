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

WITH groups_to_insert AS (
	UPDATE
		workspaces
	SET
		admins = uuid_generate_v4 ()
	WHERE
		admins ISNULL
	RETURNING
		admins AS id,
		title
) INSERT INTO GROUPS (id, title)
SELECT
	id,
	title
FROM
	groups_to_insert;

  WITH groups_to_insert AS (
	UPDATE
		workspaces
	SET
		members = uuid_generate_v4 ()
	WHERE
		members ISNULL
	RETURNING
		members AS id,
		title
) INSERT INTO GROUPS (id, title)
SELECT
	id,
	title
FROM
	groups_to_insert;

--the last 2 alter would usually be done in a separate migration
ALTER TABLE workspaces ALTER COLUMN members SET NOT NULL;
;
