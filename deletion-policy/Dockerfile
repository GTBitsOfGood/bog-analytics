FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install dependencies
RUN npm install

COPY . .

CMD ["npm", "start"]