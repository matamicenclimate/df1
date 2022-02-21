FROM node:14.18.3-alpine3.14

WORKDIR /app

RUN apk add --no-cache python3 py3-pip gcc g++ make 
RUN apk add --update \
  git \
  openssh-client \
&& rm -rf /var/cache/apk/*
RUN npm install -g node-gyp

COPY ./package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start-dev"]