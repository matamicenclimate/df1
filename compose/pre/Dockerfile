FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve
COPY . .
RUN mv ./.env.pre ./.env
RUN npm install
RUN npm run build

CMD ["serve", "-s", "./build"]
