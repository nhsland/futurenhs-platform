ALTER TABLE groups
RENAME TO teams;

-- link_ prefix to call it out as being a link table.
-- (This isn't in any style guide or anything. Just seemed like a good idea)
ALTER TABLE user_groups
RENAME TO link_users_teams;
ALTER TABLE link_users_teams
RENAME COLUMN group_id to team_id;
