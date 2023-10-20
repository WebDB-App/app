FROM node:alpine
ENV NODE_ENV=production

RUN apk update
RUN apk add mysql-client bash mongodb-tools postgresql-client python3 make g++ openssh-keygen git
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN npm run compile
RUN cp .env.production .env

RUN apk del python3 make g++

EXPOSE 22071
ENTRYPOINT NODE_ENV=production node src/index.js 3>&1 1>&2 2>&3 | tee ./static/logs/error.log
