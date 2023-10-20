FROM node:alpine
ENV NODE_ENV=production

RUN apk update
RUN apk add mysql-client bash mongodb-tools postgresql-client python3 make g++ openssh-keygen git

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install --prod --frozen-lockfile

COPY . .

RUN npm run compile
RUN cp .env.production .env

RUN apk del python3 make g++

EXPOSE 22071
ENTRYPOINT ["npm", "run", "prod"]