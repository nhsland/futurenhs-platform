INSERT INTO file_versions (
    id,
    folder,
    file,
    file_title,
    file_description,
    file_name,
    file_type,
    blob_storage_path,
    created_at,
    created_by,
    version_number,
    version_label
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9, $10, $11)
RETURNING *
