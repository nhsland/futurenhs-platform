DELETE FROM folders
WHERE id = $1
RETURNING id, title, long_description, workspace
