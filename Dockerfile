FROM node:18.12.1-slim AS builder

WORKDIR /app

COPY . .

ARG WORKSPACE=@sharp-server/image-api

RUN npm install
RUN npm run build

FROM node:18.12.1-slim AS runner

WORKDIR /app
COPY --from=builder /app /app

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start", "-w" , "@sharp-server/image-api"]