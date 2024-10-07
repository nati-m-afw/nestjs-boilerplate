<p align="center"><img align="center" style="width:320px" src="https://minimals.cc/favicon/apple-touch-icon.png"/></p><br/>
<p align="center"><strong style="font-size: 40px">CHANGE_ME</strong></p><br/>

# CHANGE_ME - API 

## Table of Contents

- [Services](#services)
- [Getting started](#getting-started)
- [Development](#development)


## Services
- Nest JS API Services
- Postgres DB
- Redis
- NGINX Proxy


## Getting started

```bash

# 1. Create Environment variables file.
cp .env.example .env

# 2. Enable memory overcommit
./queue/prod-conf/init-redis.sh
```



### Development
1. Start docker containers
```bash
make up
```

2. See backend logs
```bash
make logs
```

3. Stop docker containers
```bash
make down
```

4. Run migrations
```bash
make dc exec app yarn migration:run
```

5. Seed database (Careful, this will have permanent repercussion)
```bash
make dc exec app yarn migration:seed
```

6. Create nest.js module
```bash
make api-gen
```
Run `make` to see available commands
