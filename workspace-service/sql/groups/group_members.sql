SELECT
	users.*
FROM
	users
	JOIN user_groups ON users.id = user_groups.user_id
WHERE
	user_groups.group_id = $1
