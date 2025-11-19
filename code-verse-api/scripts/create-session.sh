#!/bin/bash

# Verifica que psql esté instalado
if ! command -v psql &> /dev/null; then
  echo "❌ PostgreSQL (psql) no está instalado."
  exit 1
fi

# Verifica que .env esté cargado
if [ ! -f .env ]; then
  echo "❌ Archivo .env no encontrado."
  exit 1
fi

# Carga las variables de entorno
export $(grep -v '^#' .env | xargs)

# Verifica que DATABASE_URL esté definida
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL no está definida en el .env"
  exit 1
fi

echo "🔎 Verificando si la tabla 'session' existe en la base de datos..."

# Ejecuta una consulta para verificar si existe la tabla 'session'
TABLE_EXISTS=$(psql "$DATABASE_URL" -tAc "SELECT to_regclass('public.session');")

if [ "$TABLE_EXISTS" = "session" ]; then
  echo "✅ La tabla 'session' ya existe."
else
  echo "⚙️  Creando tabla 'session'..."
  psql "$DATABASE_URL" -f node_modules/connect-pg-simple/table.sql
  echo "✅ Tabla 'session' creada con éxito."
fi
