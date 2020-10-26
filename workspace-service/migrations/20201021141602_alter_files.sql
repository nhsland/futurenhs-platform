ALTER TABLE files
ADD COLUMN deleted_by uuid REFERENCES users,
ADD COLUMN created_by uuid REFERENCES users,
ADD COLUMN latest_version uuid REFERENCES file_versions DEFERRABLE
;

INSERT INTO file_versions
(
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
SELECT
    folder,
    id,
    title,
    description,
    file_name,
    file_type,
    blob_storage_path,
    created_at,
    (SELECT id FROM users WHERE auth_id = 'feedface-0000-0000-0000-000000000000'),
    1,
    ''
FROM
    files;

UPDATE files
SET deleted_by = (SELECT id FROM users WHERE auth_id = 'feedface-0000-0000-0000-000000000000')
    WHERE deleted_at IS NOT NULL;

UPDATE files
SET created_by = (SELECT id FROM users WHERE auth_id = 'feedface-0000-0000-0000-000000000000');

UPDATE files
SET latest_version = (
    SELECT id
    FROM file_versions
    WHERE file = files.id
);

ALTER TABLE files
    ALTER COLUMN created_by SET NOT NULL,
    ALTER COLUMN latest_version SET NOT NULL
;

ALTER TABLE files
    DROP COLUMN title,
    DROP COLUMN description,
    DROP COLUMN folder,
    DROP COLUMN file_name,
    DROP COLUMN file_type,
    DROP COLUMN blob_storage_path,
    DROP COLUMN modified_at
;
