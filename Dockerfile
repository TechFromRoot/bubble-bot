FROM ghcr.io/puppeteer/puppeteer:24.7.2

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lockfile and manifest to leverage Docker cache
COPY pnpm-lock.yaml* package.json ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build the app
RUN pnpm run build

# Start the server using the production build
CMD ["pnpm", "run", "start:prod"]
