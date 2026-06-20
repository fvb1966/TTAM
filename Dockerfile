FROM node:20-bullseye-slim

WORKDIR /usr/src/app

# Install build tools (some native modules may need compilation)
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential python3 make gcc g++ git && \
    rm -rf /var/lib/apt/lists/*

# Copy lockfiles first for better cache
COPY package.json package-lock.json ./

RUN npm ci --no-audit --prefer-offline

# Copy the rest of the repository
COPY . .

# Generate Prisma client (uses the included SQLite file)
RUN npx prisma generate || true

# Build main and renderer (best-effort; failures won't break smoke packaging)
RUN npm run build:main || true
RUN npm run build || true

CMD ["/bin/bash"]
