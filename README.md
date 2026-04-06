# Backend Hotel (PMS)

API REST para gestión de hospedajes: establecimientos, tipos de habitación e inventario de habitaciones. Construida con **NestJS**, **Prisma** y **PostgreSQL**, lista para desarrollo con **Docker Compose**.

## Requisitos

- [Docker](https://docs.docker.com/get-docker/) y Docker Compose
- Opcional (desarrollo sin contenedor): Node 20+, [pnpm](https://pnpm.io/), PostgreSQL accesible

## Puesta en marcha con Docker

Desde la raíz del proyecto:

```bash
docker compose up -d --build
```

- **API:** [http://localhost:3000](http://localhost:3000)
- **PostgreSQL (desde el host):** `localhost` puerto **54320** (mapeado al 5432 del contenedor)
- Usuario / contraseña / base: `postgres` / `postgres` / `hotel`

El servicio `backend` usa `DATABASE_URL` apuntando al host `db` dentro de la red de Compose (no hace falta cambiarla para el contenedor).

Tras el primer arranque, aplica migraciones si aún no lo hiciste (con la base levantada):

```bash
# Desde tu máquina, con DATABASE_URL apuntando al puerto publicado (54320)
pnpm exec prisma migrate deploy
```

O con una variable en línea (PowerShell / bash):

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54320/hotel" pnpm exec prisma migrate deploy
```

Si añades dependencias en `package.json`, reconstruye la imagen del backend:

```bash
docker compose build --no-cache backend
docker compose up -d
```

Si `class-validator` u otros paquetes “no aparecen” en el contenedor, el volumen de `node_modules` puede estar desactualizado:

```bash
docker compose exec backend pnpm install
docker compose restart backend
```

## Desarrollo local (sin Docker)

```bash
pnpm install
# Crea `.env` con DATABASE_URL apuntando a tu Postgres (ver abajo)
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run start:dev
```

`DATABASE_URL` típica en local: `postgresql://postgres:postgres@localhost:5432/hotel` (ajusta puerto/usuario según tu instalación).

## Scripts útiles

| Comando | Descripción |
|--------|-------------|
| `pnpm run start:dev` | Nest en modo watch |
| `pnpm run build` | Compila (ejecuta `prisma generate` antes vía `prebuild`) |
| `pnpm run test` | Tests unitarios |
| `pnpm run lint` | ESLint |

## Estructura del código (DDD)

- `src/shared/prisma` — cliente Prisma (global)
- `src/property` — contexto establecimiento / tipos / habitaciones (`domain`, `application`, `infrastructure`, `presentation`)

Rutas principales bajo `/properties` (CRUD parcial de inventario; ver controlador para el detalle).

## Licencia

UNLICENSED (privado).
