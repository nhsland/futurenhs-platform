INSERT INTO files (title, description, folder, file_name, file_type, blob_storage_path, created_at, modified_at, deleted_at)
VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW(), NULL) 
RETURNING *