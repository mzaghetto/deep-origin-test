FROM node:18.20.8-alpine AS dev
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 30001
CMD ["npm", "run", "dev"]

FROM node:18.20.8-alpine AS prod
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build
EXPOSE 30001
CMD ["npm", "start"]
