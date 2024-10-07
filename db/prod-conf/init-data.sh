#!/bin/bash
123
set -e;
if [ -n "${DB_USER:-}" ] && [ -n "${DB_PASS:-}" ]; then
	psql -v ON_ERROR_STOP=1 --username "$DB_USER"  <<-EOSQL
		CREATE DATABASE ${DB_DATABASE};
		GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
	EOSQL
else
	echo "SETUP INFO: No Environment variables given!"
fi
