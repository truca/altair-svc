# 🚀 Deployment Guide - Altair UI

Este documento describe el proceso completo de deployment del proyecto Altair UI usando Docker y GitHub Actions.

## 📋 Resumen

El proyecto utiliza un pipeline de CI/CD automatizado que:
1. Construye una imagen Docker al hacer push a `main`
2. La almacena en GitHub Container Registry (GHCR)
3. La despliega automáticamente en un droplet de DigitalOcean

## 🏗️ Arquitectura de Deployment

```
Local Development → GitHub (main branch) → GitHub Actions → GHCR → DigitalOcean Droplet
```

## 🐳 Configuración Docker

### Dockerfile
El proyecto incluye un `Dockerfile` optimizado para Yarn v4:

```dockerfile
FROM node:20
RUN corepack enable
WORKDIR /app

# Copy package files and yarn configuration
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

# Install dependencies (immutable for reproducible builds)
RUN yarn install --immutable

# Copy source code
COPY . .

# Install TypeScript and build
RUN yarn add typescript@5.6.3 --dev
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
```

### .dockerignore
```
!.env
```

## ⚙️ GitHub Actions Pipeline

### Archivo: `.github/workflows/deploy.yml`

El pipeline se ejecuta automáticamente en cada push a `main` y consta de dos jobs:

#### Job 1: Build & Push
1. **Checkout** del código
2. **Login** a GitHub Container Registry
3. **Crear archivo .env** con secrets
4. **Build** de la imagen Docker
5. **Push** a GHCR con tags `latest` y `commit-sha`

#### Job 2: Deploy
1. **Instalar SSH key** para conectar al droplet
2. **SSH al droplet** y ejecutar:
   - Login a GHCR
   - Pull de la imagen `latest`
   - `docker compose down`
   - `docker compose up -d`

## 🔑 Secrets Requeridos

Configura estos secrets en GitHub Settings → Secrets and variables → Actions:

### GHCR (GitHub Container Registry)
- `GHCR_TOKEN` - Personal Access Token con permisos de packages
- `GHCR_USERNAME` - Tu username de GitHub

### DigitalOcean Droplet
- `DROPLET_SSH_KEY` - Clave SSH privada para acceso al droplet
- `DROPLET_IP` - Dirección IP del droplet

### Environment Variables
- `FIREBASE_PRIVATE_KEY` - Clave privada de Firebase
- `FIREBASE_PROJECT_ID` - ID del proyecto Firebase
- `FIREBASE_CLIENT_EMAIL` - Email del cliente Firebase

## 🖥️ Configuración del Droplet

### Requisitos en el Droplet
El droplet debe tener instalado:
- Docker
- Docker Compose
- SSH access configurado

### docker-compose.yml (en el droplet)
Crea un archivo `docker-compose.yml` en el home directory del droplet:

```yaml
version: '3.8'
services:
  altair-ui:
    image: ghcr.io/[TU-USERNAME]/altair-ui:latest
    ports:
      - "80:3000"
      - "443:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    pull_policy: always
```

## 🚀 Proceso de Deployment

### Deployment Automático
```bash
# 1. Hacer cambios en el código
git add .
git commit -m "feat: nueva funcionalidad"

# 2. Push a main (esto triggerea el deployment)
git push origin main

# 3. El pipeline se ejecuta automáticamente:
#    - Build → Push → Deploy
```

### Monitoring del Deployment
1. Ve a **GitHub → Actions** para ver el progreso
2. Los logs muestran cada paso del proceso
3. El deployment completo toma ~5-10 minutos

### Verificación Post-Deployment
```bash
# Verificar que el contenedor está corriendo
ssh root@[DROPLET_IP]
docker ps
docker logs [CONTAINER_ID]
```

## 🧪 Testing Local con Docker

### Build Local
```bash
# Construir imagen
docker build -t altair-ui-local .

# Correr localmente
docker run -p 3000:3000 altair-ui-local

# Verificar en http://localhost:3000
```

### Debug de Build Issues
```bash
# Build con logs detallados
docker build --no-cache --progress=plain -t altair-ui-debug .

# Correr en modo interactivo
docker run -it --entrypoint /bin/bash altair-ui-debug
```

## 🔧 Troubleshooting

### Problemas Comunes

#### 1. Error de Yarn en Docker
```bash
# Si falla yarn install
RUN corepack enable
RUN yarn set version 4.1.1
```

#### 2. Secrets No Configurados
```
Error: GHCR_TOKEN is not set
```
**Solución**: Verificar que todos los secrets estén configurados en GitHub

#### 3. SSH Connection Failed
```
Error: Permission denied (publickey)
```
**Solución**:
- Verificar que `DROPLET_SSH_KEY` sea la clave privada correcta
- Verificar que la clave pública esté en `~/.ssh/authorized_keys` del droplet

#### 4. Docker Compose Not Found
```
Error: docker compose: command not found
```
**Solución**: Crear `docker-compose.yml` en el droplet

### Logs Útiles
```bash
# Ver logs del deployment
ssh root@[DROPLET_IP]
docker logs [CONTAINER_NAME]

# Ver logs de GitHub Actions
# GitHub → Repository → Actions → Select workflow run
```

## 📊 Métricas y Monitoring

### Health Check
```bash
# Verificar que la app responde
curl http://[DROPLET_IP]:3000

# Verificar estado del contenedor
docker ps
docker stats
```

### Rollback
```bash
# En caso de problemas, hacer rollback
ssh root@[DROPLET_IP]
docker pull ghcr.io/[USERNAME]/altair-ui:[PREVIOUS_SHA]
docker tag ghcr.io/[USERNAME]/altair-ui:[PREVIOUS_SHA] ghcr.io/[USERNAME]/altair-ui:latest
docker compose up -d
```

## 🔄 Workflow Alternativo (Manual)

Si necesitas deployar manualmente:

```bash
# 1. Build local
docker build -t ghcr.io/[USERNAME]/altair-ui:manual .

# 2. Push manual
echo $GHCR_TOKEN | docker login ghcr.io -u [USERNAME] --password-stdin
docker push ghcr.io/[USERNAME]/altair-ui:manual

# 3. Deploy manual en droplet
ssh root@[DROPLET_IP]
docker pull ghcr.io/[USERNAME]/altair-ui:manual
docker tag ghcr.io/[USERNAME]/altair-ui:manual ghcr.io/[USERNAME]/altair-ui:latest
docker compose up -d
```

## 📝 Notas Adicionales

- **Tiempo de Build**: ~3-5 minutos
- **Tiempo de Deploy**: ~2-3 minutos
- **Downtime**: ~30 segundos durante el restart
- **Rollback Time**: ~1-2 minutos

## 🔗 Enlaces Útiles

- [GitHub Container Registry](https://ghcr.io)
- [DigitalOcean Droplets](https://www.digitalocean.com/products/droplets/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)