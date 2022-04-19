FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve

RUN mv ./.env.prod ./.env
COPY ./build .

CMD ["serve", "-s", "."]
