-- This is an adapted migration based on:
-- https://github.com/voxpelli/node-connect-pg-simple/blob/fc163b26511d746452ef42c798ab766caca2a5ac/table.sql
--
-- Changes were:
-- - Add "IF NOT EXISTS" to make script idempotent
-- - Move primary key constraint into CREATE TABLE statement to make it easier to make this idempotent

CREATE TABLE IF NOT EXISTS "session" (
	"sid" varchar NOT NULL COLLATE "default" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE,
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
