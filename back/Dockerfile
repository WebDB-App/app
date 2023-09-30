FROM node:alpine
ENV NODE_ENV=production

RUN apk update
RUN apk add mysql-client bash mongodb-tools postgresql-client python3 make g++ openssh-keygen

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install --prod --frozen-lockfile

COPY . .

RUN npm run obfuscate
RUN cp .env.production .env

EXPOSE 22071
ENTRYPOINT ["npm", "run", "start"]
