UPDATE files
SET deleted_at = NOW(), deleted_by = $2
FROM file_versions
WHERE files.id = $1
AND files.latest_version = file_versions.id
RETURNING
    files.id,
    file_versions.file_title AS title,
    file_versions.file_description AS description,
    file_versions.folder,
    file_versions.file_name,
    file_versions.blob_storage_path,
    file_versions.file_type,
    files.created_at,
    file_versions.created_at AS modified_at,
    files.deleted_at,
    files.latest_version
