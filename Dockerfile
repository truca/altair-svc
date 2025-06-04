FROM node:20.18.1-alpine3.21 AS builder

WORKDIR /usr/src/app
ARG NPM_TOKEN
RUN npm config set "@digital-retail:registry=https://gitlab.falabella.tech/api/v4/packages/npm/" && \
    npm config set "//gitlab.falabella.tech/api/v4/packages/npm/:_authToken=$NPM_TOKEN" && \
    npm config set "//gitlab.falabella.tech/api/v4/projects/66385/packages/npm/:_authToken=$NPM_TOKEN"
COPY package*.json ./
RUN npm ci --no-audit --ignore-scripts
COPY . .
RUN npm run build

FROM node:20.18.1-alpine3.21 AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package*.json .
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
RUN apk add --no-cache tini=0.19.0-r3 && \
    addgroup app && \
    adduser -S -G app app
USER app
ENV PORT=8080 \
    NODE_ENV=production \
    LOG_LEVEL=error \
    MAX_EVENT_LOOP_DELAY=1000 \
    MAX_RSS_BYTES=0 \
    MAX_HEAP_USED_BYTES=0 \
    MAX_AGE=86400
EXPOSE $PORT
ENTRYPOINT ["tini", "--"]
CMD ["node", "--max-http-header-size=24000", "dist/src/main"]
