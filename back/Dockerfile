FROM node:alpine
ENV NODE_ENV=production

RUN apk update
RUN apk add mysql-client bash mongodb-tools postgresql-client python3 make g++ openssh-keygen
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /usr/src/app

COPY ./package.json ./pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN npm run obfuscate
RUN cp .env.production .env

EXPOSE 22071
ENTRYPOINT ["npm", "run", "start"]
