DROP TABLE IF EXISTS Posts;

CREATE TABLE IF NOT EXISTS Posts (
    author STRING NOT NULL,
    rkey STRING NOT NULL, 
    time_us INTEGER NOT NULL,
    likes INTEGER NOT NULL,
    updated INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_updated ON Posts(updated);