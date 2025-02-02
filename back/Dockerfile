FROM node:22-slim
ENV NODE_ENV=production

RUN apt update
RUN apt upgrade -y
RUN apt install -y --no-install-recommends gnupg lsb-release wget ca-certificates python3 make g++
RUN update-ca-certificates
RUN wget -qO- https://www.mongodb.org/static/pgp/server-8.0.asc | tee /etc/apt/trusted.gpg.d/server-8.0.asc
RUN wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/postgresql.gpg
RUN echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list
RUN echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/8.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-8.0.list
RUN apt update
RUN apt install -y --no-install-recommends default-mysql-client mongodb-database-tools postgresql-client-17 git sshpass openssh-client

WORKDIR /usr/src/app

COPY ./package.json ./package-lock.json ./

RUN npm install --prod --frozen-lockfile

COPY . .

RUN cp .env.production .env

RUN apt autoremove --purge -y gnupg lsb-release wget ca-certificates python3 make g++
RUN apt autoremove -y
RUN apt clean
RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN rm -rf /root/.cache /root/.local /root/.npm
RUN rm -f /usr/bin/mongofiles /usr/bin/mongostat /usr/bin/mongoexport /usr/bin/mongotop /usr/bin/mongostat /usr/bin/mariadb-check /usr/bin/bsondump

EXPOSE 22071
ENTRYPOINT ["node", "src/index.js"]
