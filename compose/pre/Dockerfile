FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve

COPY ./build .
RUN mv ./.env.pre ./.env

CMD ["serve", "-s", "."]
