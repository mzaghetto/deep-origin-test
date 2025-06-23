FROM node:18.20.8-alpine

WORKDIR /app

RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY prisma/schema.prisma ./prisma/
RUN npm install

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 40001

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = \"test\" ]; then npm test; else npx prisma migrate deploy && npm run start:dev; fi"]