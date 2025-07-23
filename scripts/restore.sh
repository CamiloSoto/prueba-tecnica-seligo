#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "❗ Debes proporcionar el nombre del archivo de backup."
  echo "Uso: ./scripts/restore.sh backup_2025-07-23_12-00-00.sql"
  exit 1
fi

echo "⚠️ Restaurando base de datos desde $1..."

cat ./scripts/$1 | docker exec -i postgres_local psql -U seligo prueba_tecnica

echo "✅ Restauración completada."
