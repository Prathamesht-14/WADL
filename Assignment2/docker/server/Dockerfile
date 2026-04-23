FROM node:18-alpine

# Install g++ for compiling and executing C++ code
RUN apk add --no-cache g++

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

# Ensure tmp directory exists and has appropriate permissions
RUN mkdir -p tmp && chmod 777 tmp

EXPOSE 3001
CMD ["npm", "start"]
