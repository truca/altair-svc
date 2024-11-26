# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install --production --frozen-lockfile --ignore-scripts

# Copy the rest of your application code
COPY . .

# Install TypeScript as a dev dependency
RUN yarn add --dev typescript@5.1.6

# Build the TypeScript project
RUN yarn build

# Expose the port your application runs on
EXPOSE 4000

# Command to run your application
CMD ["yarn", "start"]