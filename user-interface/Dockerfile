FROM node:23-alpine3.21 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# Production image
FROM node:23-alpine3.21

WORKDIR /app

COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./

RUN npm install --production

EXPOSE 3002

CMD ["npm", "run", "start"]
