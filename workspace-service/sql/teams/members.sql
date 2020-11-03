SELECT
	users.*
FROM
	users
	JOIN link_users_teams ON users.id = link_users_teams.user_id
WHERE
	link_users_teams.team_id = $1
ORDER BY
	users.name
