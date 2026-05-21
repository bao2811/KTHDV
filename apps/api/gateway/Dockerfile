FROM node:20-alpine AS builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/gateway/package.json apps/api/gateway/package.json
COPY apps/api/candidate-service/package.json apps/api/candidate-service/package.json
COPY apps/api/job-service/package.json apps/api/job-service/package.json
COPY apps/api/interview-service/package.json apps/api/interview-service/package.json
COPY apps/api/matching-service/package.json apps/api/matching-service/package.json
COPY apps/api/notification-service/package.json apps/api/notification-service/package.json
COPY libs/common/package.json libs/common/package.json
COPY libs/database/package.json libs/database/package.json

RUN npm ci

COPY . .

RUN npm run prisma:generate -w apps/api/gateway
RUN npm run build -w apps/api/gateway
RUN npm prune --omit=dev

FROM node:20-alpine AS runner

WORKDIR /app/apps/api/gateway

RUN apk add --no-cache openssl

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/apps/api/gateway /app/apps/api/gateway

EXPOSE 3000

CMD ["node", "dist/main"]
