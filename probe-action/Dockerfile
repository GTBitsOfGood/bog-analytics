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

RUN apt-get update -qq -y && \
    apt-get install -y \
        libasound2 \
        libatk-bridge2.0-0 \
        libgtk-4-1 \
        libnss3 \
        xdg-utils \
        wget && \
    wget -q -O chrome-linux64.zip https://storage.googleapis.com/chrome-for-testing-public/121.0.6167.85/linux64/chrome-linux64.zip && \
    unzip chrome-linux64.zip && \
    rm chrome-linux64.zip && \
    mv chrome-linux64 /opt/chrome/ && \
    ln -s /opt/chrome/chrome /usr/local/bin/ && \
    wget -q -O chromedriver-linux64.zip https://storage.googleapis.com/chrome-for-testing-public/121.0.6167.85/linux64/chromedriver-linux64.zip && \
    unzip -j chromedriver-linux64.zip chromedriver-linux64/chromedriver && \
    rm chromedriver-linux64.zip && \
    mv chromedriver /usr/local/bin/

ENV CHROMEDRIVER_SKIP_DOWNLOAD=true

# Run the Node.js script
CMD ["node", "/app/probe.js"]