# ---- Stage 1: Build Stage ----
FROM node:18 AS builder

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package.json yarn.lock ./

# Instala todas las dependencias (producción y desarrollo)
RUN yarn install --frozen-lockfile

# Copia el resto del código fuente
COPY . .

# Compila el proyecto usando TypeScript (el comando "build" está definido en package.json)
RUN yarn build

# ---- Stage 2: Production Image ----
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos de definición de dependencias
COPY package.json yarn.lock ./

# Instala solo las dependencias de producción
RUN yarn install --production --frozen-lockfile

# Copia el código compilado desde la etapa anterior
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto en el que corre la aplicación (ajusta si es necesario)
EXPOSE 4000

# Comando para ejecutar la aplicación (ejecuta el código compilado)
CMD ["node", "dist/main.js"]
