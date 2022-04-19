FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN npm install -g serve
RUN mv ./.env.pre ./.env
RUN npm run build

CMD ["serve", "-s", "./build"]
