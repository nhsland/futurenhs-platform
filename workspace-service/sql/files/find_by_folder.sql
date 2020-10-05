SELECT id,
    title,
    description,
    folder_id,
    file_name,
    file_type,
    blob_storage_path,
    created_at,
    modified_at,
    deleted_at

FROM files
WHERE folder_id = $1
