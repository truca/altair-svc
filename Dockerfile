FROM node:20.18.1-alpine3.21 AS builder

# Enable corepack and set up Yarn
RUN corepack enable

WORKDIR /usr/src/app

# Copy Yarn configuration files
COPY package.json yarn.lock ./

# Install dependencies (immutable for reproducible builds)
RUN yarn install --immutable

# Copy source code
COPY . .

# Build the project
RUN yarn build

FROM node:20.18.1-alpine3.21 AS runner

# Enable corepack for Yarn support
RUN corepack enable

WORKDIR /usr/src/app

# Copy package files and Yarn configuration
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Set up security and permissions
RUN apk add --no-cache tini=0.19.0-r3 && \
    addgroup app && \
    adduser -S -G app app
USER app

# Environment variables
ENV PORT=4000 \
    NODE_ENV=production \
    LOG_LEVEL=error \
    MAX_EVENT_LOOP_DELAY=1000 \
    MAX_RSS_BYTES=0 \
    MAX_HEAP_USED_BYTES=0 \
    MAX_AGE=86400

EXPOSE $PORT
ENTRYPOINT ["tini", "--"]
CMD ["node", "--max-http-header-size=24000", "dist/src/main"]
