#!/bin/bash
set -e

DATE=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="backup_$DATE.sql"

echo "📦 Creando backup de la base de datos..."
docker exec -t postgres_local pg_dump -U seligo prueba_tecnica > ./scripts/$BACKUP_FILE

echo "✅ Backup guardado en scripts/$BACKUP_FILE"