CREATE TABLE IF NOT EXISTS files (
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    folder_id uuid NOT NULL REFERENCES folders,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    blob_storage_path TEXT NOT NULL,
    created_at timestamptz NOT NULL,
    modified_at timestamptz NOT NULL,
    deleted_at timestamptz,
    PRIMARY KEY (id)
);
