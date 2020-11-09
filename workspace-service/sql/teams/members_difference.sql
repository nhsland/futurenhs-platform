WITH user_ids as (
    SELECT user_id FROM link_users_teams WHERE team_id = $1
    EXCEPT
    SELECT user_id FROM link_users_teams WHERE team_id = $2
)
SELECT
	users.*
FROM
	users
	JOIN user_ids ON users.id = user_ids.user_id
ORDER BY
	users.name
