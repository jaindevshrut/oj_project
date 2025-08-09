FROM node:22-alpine3.21

WORKDIR /app


RUN apk update && apk add --no-cache g++ gcc python3 openjdk17 
COPY . .
RUN npm install

EXPOSE 8001

CMD ["node", "index.js"]