FROM node:18-slim
RUN apt-get update -y && apt-get install -y openssl ca-certificates
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

COPY . .
EXPOSE 3000
CMD ["node", "server.js"]