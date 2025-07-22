FROM node:18-alpine AS frontend-build

WORKDIR /app

COPY frontend ./frontend

WORKDIR /app/frontend

RUN npm install && npm run build


FROM node:18-alpine AS backend

WORKDIR /app

COPY backend ./backend

WORKDIR /app/backend

RUN npm install --production


FROM node:18-alpine AS final

WORKDIR /app

COPY --from=backend /app/backend ./backend

COPY --from=frontend-build /app/frontend/dist ./frontend/dist

RUN npm install -g serve


ENV NODE_ENV=production \
    PORT=4000 \
    FRONTEND_PATH=./frontend/dist


EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

CMD ["node", "backend/dist/main.js"]
