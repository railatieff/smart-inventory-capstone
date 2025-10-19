# Use the official Node.js 18 image (Debian-based)
# This full image is more compatible with libraries like Next.js's SWC compiler
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package manifests (package.json, yarn.lock, etc.)
COPY package*.json ./
COPY yarn.lock ./

# Install frontend dependencies using Yarn (often faster)
# Using 'yarn install' is recommended if a yarn.lock file is present
RUN yarn install

# Copy the rest of the frontend source code into the container
COPY . .

# Expose the port the Next.js dev server will run on
EXPOSE 3001

# The command to start the Next.js development server
CMD [ "yarn", "dev" ]