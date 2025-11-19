#!/bin/bash

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
  echo "PostgreSQL is not installed. Please install PostgreSQL."
  exit 1
fi

# Check if environment variables are set
if [ -z "$DB_HOST" ] || [ -z "$DB_PORT" ] || [ -z "$DB_USER" ] || [ -z "$DB_PASSWORD" ] || [ -z "$DB_NAME" ]; then
  echo "Error: One or more required environment variables (DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT) are not set in .env."
  exit 1
fi

# Check if PostgreSQL is running
if ! systemctl is-active --quiet postgresql; then
  echo "PostgreSQL is not running. Starting PostgreSQL..."
  sudo systemctl start postgresql
fi

# Check if the PostgreSQL user already exists
USER_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'")

# Check if the database already exists
DB_EXISTS=$(sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")

# Create user if it does not exist
if [ -z "$USER_EXISTS" ]; then
  sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
  echo "User $DB_USER created."
else
  echo "User $DB_USER already exists."
fi

# Create database if it does not exist
if [ -z "$DB_EXISTS" ]; then
  sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
  echo "Database $DB_NAME created and privileges granted to $DB_USER."
else
  echo "Database $DB_NAME already exists."
fi
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER ROLE $DB_USER CREATEDB;"

# Add database URL to .env if not already present
if ! grep -q "DATABASE_URL=" .env; then
  echo "DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME?schema=public" >> .env
  echo "DATABASE_URL added to .env"
else
  echo "DATABASE_URL already present in .env"
fi
