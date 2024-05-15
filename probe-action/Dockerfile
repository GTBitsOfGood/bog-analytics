# Use the official Node.js image as base
FROM node:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the Selenium script files to the working directory
COPY ./probe.js ./

USER root
RUN apt-get update                             \
 && apt-get install -y --no-install-recommends \
    ca-certificates curl firefox-esr           \
 && rm -fr /var/lib/apt/lists/*                \
 && curl -L https://github.com/mozilla/geckodriver/releases/download/v0.30.0/geckodriver-v0.30.0-linux64.tar.gz | tar xz -C /usr/local/bin \
 && apt-get purge -y ca-certificates curl
 
 # Set environment variable to run Firefox in headless mode
ENV FIREFOX_BIN=/usr/local/bin/firefox
ENV MOZ_HEADLESS=1

# Run the Node.js script
CMD ["node", "/app/probe.js"]
