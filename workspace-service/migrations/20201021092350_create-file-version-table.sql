CREATE TABLE file_versions (
    id uuid DEFAULT uuid_generate_v4 (),
    folder uuid NOT NULL REFERENCES folders,
    file uuid NOT NULL REFERENCES files,
    file_title TEXT NOT NULL,
    file_description TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    blob_storage_path TEXT NOT NULL,
    created_at timestamptz NOT NULL,
    created_by uuid NOT NULL REFERENCES users,
    version_number SMALLINT NOT NULL,
    version_label TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (id)
);
