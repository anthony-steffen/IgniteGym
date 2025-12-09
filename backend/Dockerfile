# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app-backend

# Copy the package.json file and the package-lock.json file to the container
COPY package* .

# Install the dependencies using npm
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the application will run on
EXPOSE 3001

# Run the application
CMD [ "npm", "start" ]