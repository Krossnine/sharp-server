FROM node:18.12.1-slim AS builder

WORKDIR /app

COPY . .

ARG WORKSPACE=@sharp-server/image-api-doc

RUN npm install --workspace=$WORKSPACE
RUN npm run build --workspace=$WORKSPACE
RUN npm install  --workspace=$WORKSPACE --omit=dev

FROM node:18.12.1-slim AS runner

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3001
ENV PORT 3001

CMD ["npm", "start", "-w" , "@sharp-server/image-api-doc"]
