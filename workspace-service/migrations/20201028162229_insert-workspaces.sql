INSERT INTO groups (
  id,
  title
) VALUES (
  '66aea3a6-6775-4f85-90a9-05a71766c25f',
  'Example workspace Members'
);

INSERT INTO user_groups (
  user_id,
  group_id
  )
SELECT
	users.id,
	'66aea3a6-6775-4f85-90a9-05a71766c25f'
FROM
	users;

INSERT INTO groups (
  id,
  title
) VALUES (
  '3d9144cd-f5f9-4126-84b8-1fb7a69f1ab7',
  'Example workspace Admins'
);

INSERT INTO user_groups (user_id, group_id)
SELECT
	users.id,
	'3d9144cd-f5f9-4126-84b8-1fb7a69f1ab7'
FROM
	users
WHERE
	email_address = 'lisa.pink@example.com';



INSERT INTO workspaces (title, description, members, admins)
VALUES (
	'Example workspace',
	'Example workspace description',
	'66aea3a6-6775-4f85-90a9-05a71766c25f',
	'3d9144cd-f5f9-4126-84b8-1fb7a69f1ab7'
);
