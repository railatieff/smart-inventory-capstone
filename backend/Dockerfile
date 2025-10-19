# Use the official Node.js 18 image (Debian-based)
# This full image is more compatible with libraries than 'alpine'
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package manifests (package.json, package-lock.json)
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend source code into the container
COPY . .

# The command to start the server in development mode (using nodemon)
CMD [ "npm", "run", "dev" ]