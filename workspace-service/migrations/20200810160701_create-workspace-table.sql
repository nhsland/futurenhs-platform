CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS workspace (
    id uuid DEFAULT uuid_generate_v4 (),
    title TEXT NOT NULL,
    PRIMARY KEY (id)
);
