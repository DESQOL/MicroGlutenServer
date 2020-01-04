# Micro(service) GlutenServer

[![Greenkeeper badge](https://badges.greenkeeper.io/DESQOL/MicroGlutenServer.svg)](https://greenkeeper.io/)

## Services

### Aggregator
Exposes the API that end user can use.

### Balancer
Round-robin based balancing for the following services:
- Aggregator
- Token

### Recipe
TODO

### Token
TODO

### User
TODO

----

## Docker

### Start
```bash
$ docker-compose.exe up --detach --build \
    --scale token-service=5 \
    --scale aggregator-service=5
```
