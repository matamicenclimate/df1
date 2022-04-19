FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve

RUN mv ./.env.pre ./.env
COPY ./build .

CMD ["serve", "-s", "."]
