FROM node:18.20.8-alpine

WORKDIR /app

# Instala as dependências do sistema necessárias para o Prisma
RUN apk add --no-cache openssl
COPY package.json package-lock.json* ./
COPY prisma/schema.prisma ./prisma/
RUN npm install

# Gera o cliente Prisma
RUN npx prisma generate

# Copia o restante dos arquivos
COPY . .

# Build da aplicação
RUN npm run build

EXPOSE 40001

# Comando modificado para rodar as migrações antes de iniciar
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]
