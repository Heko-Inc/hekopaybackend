# Use an official Node.js image
FROM node:18

# Set working directory inside container
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .
COPY .env .
# Expose port (change if your app runs on a different one)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
