FROM node:22.1.0-alpine3.18 as dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]

FROM node:22.1.0-alpine3.18 as dev-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

FROM node:22.1.0-alpine3.18 as builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22.1.0-alpine3.18 as prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production --frozen-lockfile

FROM node:22.1.0-alpine3.18 as prod
EXPOSE ${APP_PORT}
WORKDIR /app
ENV APP_VERSION=${APP_VERSION}
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

CMD ["node","dist/main.js"]
