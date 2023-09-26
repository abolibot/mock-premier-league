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

RUN pnpm install --omit=dev

COPY --chown=app:app . .

RUN pnpm run build

EXPOSE 3000

CMD [ "node", "dist/index.js" ]