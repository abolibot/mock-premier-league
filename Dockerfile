# base
FROM node:18-alpine3.18 AS base

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN pnpm pkg delete scripts.prepare
    
RUN pnpm install

COPY . .

# for build

FROM base as builder

WORKDIR /app

RUN pnpm run build

# for prod 

FROM node:18-alpine3.18

RUN adduser -s /bin/sh -D app
RUN addgroup app app
RUN addgroup app root
RUN mkdir /app && chown -R app:app /app

RUN npm install -g pnpm

WORKDIR /app

COPY --chown=app:app package.json ./
COPY --chown=app:app pnpm-lock.yaml ./

USER app

RUN pnpm pkg delete scripts.prepare
RUN pnpm install --prod

COPY --chown=app:app --from=builder /app/build ./build
COPY --chown=app:app --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "node", "dist/index.js" ]