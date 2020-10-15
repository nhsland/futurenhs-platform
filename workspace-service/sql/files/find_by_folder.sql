SELECT id,
    title,
    description,
    folder,
    file_name,
    file_type,
    blob_storage_path,
    created_at,
    modified_at,
    deleted_at

FROM files
WHERE folder = $1
AND deleted_at IS NULL
ORDER BY title
