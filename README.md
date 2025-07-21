# prueba tecnica seligo


```bash
# Corre el contenedor
docker-compose up -d
# Verifica que el volumen se haya creado
docker volume ls
# Ver el contenido con:
docker volume inspect pgdata
# psql -h localhost -U seligo -d prueba_tecnica
```