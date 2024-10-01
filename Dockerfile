# Use an official Node.js runtime as a parent image
FROM node:21

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies first
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the necessary port (adjust this if your app uses another port)
EXPOSE 3000

# Start the app (ensure this points to your main script)
CMD ["npm", "start"]