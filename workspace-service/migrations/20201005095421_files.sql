CREATE TABLE IF NOT EXISTS files (
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    folder_id uuid NOT NULL REFERENCES workspaces,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    blob_storage_path TEXT NOT NULL,
    created_at timestamp NOT NULL,
    modified_at timestamp NOT NULL,
    deleted_at timestamp,
    PRIMARY KEY (id)
);
