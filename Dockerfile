FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/backend/package*.json ./backend/
COPY --from=builder /app/frontend/package*.json ./frontend/

RUN npm install --production

EXPOSE 3001

CMD ["npm", "start"]