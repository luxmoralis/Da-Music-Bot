# Use the official Node.js image as the base image
FROM node:lts-bookworm-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Command to run the application
CMD ["npm", "start"]
