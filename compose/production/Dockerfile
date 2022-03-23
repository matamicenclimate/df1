FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve

COPY ./build .
COPY ./package.json .
COPY ./tsconfig.json .
COPY ./node_modules/ .

CMD ["serve", "-s", "build"]
