# ---- Stage 1: Build Stage ----
    FROM node:18 AS builder

    WORKDIR /app
    
    # Copy package.json and yarn.lock to install dependencies
    COPY package.json yarn.lock ./
    RUN yarn install --frozen-lockfile
    
    # Copy the entire project
    COPY . .
    
    # Compile TypeScript (output should go to /app/dist)
    RUN yarn build
    
    # ---- Stage 2: Production Image ----
    FROM node:18-alpine
    
    WORKDIR /app
    
    # Copy package.json and install only production dependencies
    COPY package.json yarn.lock ./
    RUN yarn install --production --frozen-lockfile
    
    # Copy compiled files from builder stage
    COPY --from=builder /app/dist ./dist
    
    # Set the working directory to dist where main.js is located
    WORKDIR /app/dist
    
    # List files in dist to confirm `main.js` exists
    RUN ls -l
    
    EXPOSE 4000
    
    # Run the built application
    CMD ["node", "main.js"]