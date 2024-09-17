-- create_tables.sql
CREATE TABLE IF NOT EXISTS "game-standing" (
    id SERIAL PRIMARY KEY,
    game VARCHAR(255) NOT NULL,
    data JSONB NOT NULL,
    community VARCHAR(255) NOT NULL,
    isPrivate BOOLEAN NOT NULL,
    createdAt TIMESTAMPTZ DEFAULT NOW()
);
