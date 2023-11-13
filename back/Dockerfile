FROM node:alpine
ENV NODE_ENV=production

RUN apk update
RUN apk add mysql-client bash mongodb-tools postgresql-client python3 make g++ git

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install --prod --frozen-lockfile

COPY . .

RUN npm run compile
RUN cp .env.production .env

RUN apk del --purge python3 make g++
RUN cd /root/ && rm -rf .cache/ .local/ .npm/ && cd /usr/bin/ && rm -rf mongofiles mongostat mongoexport mongotop mongostat mariadb-check bsondump

EXPOSE 22071
ENTRYPOINT NODE_ENV=production node src/index.js
