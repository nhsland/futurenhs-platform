CREATE TABLE IF NOT EXISTS folders (
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    long_description TEXT NOT NULL,
    workspace uuid NOT NULL REFERENCES workspaces,
    PRIMARY KEY (id)
);
