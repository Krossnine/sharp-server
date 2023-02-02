FROM node:18.12.1-slim AS builder

WORKDIR /app

COPY . .

ARG WORKSPACE=@sharp-server/api

RUN npm install --workspace=$WORKSPACE
RUN npm run build --workspace=$WORKSPACE
RUN npm install  --workspace=$WORKSPACE --omit=dev

FROM node:18.12.1-slim AS runner

WORKDIR /app
COPY --from=builder /app /app

ENV PORT 3000
EXPOSE 3000

CMD ["npm", "start", "-w" , "@sharp-server/api"]