FROM node:16-alpine AS builder

ENV NODE_ENV build


USER node
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npx prisma generate
RUN npm run build \
    && npm prune --production




CMD ["npm", "run", "start:prod"]