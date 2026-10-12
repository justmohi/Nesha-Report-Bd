FROM node:24-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

# Install all runtime/build dependencies (tsx is required to run the Express API).
COPY package.json ./
RUN npm install --no-audit --no-fund

# Copy application source and build the Vite frontend plus Bangladesh geography data.
COPY . .
RUN npm run build

ENV PORT=8080
EXPOSE 8080

# Cloud Run injects PORT; server.ts binds to 0.0.0.0.
CMD ["npm", "run", "start"]
