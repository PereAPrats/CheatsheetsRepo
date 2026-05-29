#!/bin/bash
# PostgreSQL initialization script — runs on first container start
# Creates the application user with limited permissions and the users table
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  -- Create app user with limited schema-level permissions (not a superuser)
  CREATE USER ${APP_DB_USER} WITH PASSWORD '${APP_DB_PASSWORD}';
  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${APP_DB_USER};
  GRANT USAGE ON SCHEMA public TO ${APP_DB_USER};
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${APP_DB_USER};
  GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO ${APP_DB_USER};
  -- Ensure future tables also get the same permissions
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ${APP_DB_USER};
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE ON SEQUENCES TO ${APP_DB_USER};

  -- Users table: each row is a registered user with their cheatsheet data in a JSONB column
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL DEFAULT '',
    data JSONB DEFAULT '{"categories":[]}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
EOSQL
