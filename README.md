# Micro(service) GlutenServer

## Docker

### Start
```bash
$ docker-compose.exe up --detach --build \
    --scale token-service=5 \
    --scale aggregator-service=5
```
