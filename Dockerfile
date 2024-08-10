# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build
# Manually install the the following packages as they are not being installed for some reason.
# TODO: Investigate why these packages are not being installed.
RUN npm install @aws-sdk/util-dynamodb@^3.624.0
RUN npm install  @aws-sdk/client-dynamodb@^3.624.0

# Expose the port the app runs on
EXPOSE 3000
