## Preamble

I currently use GitLab for git related stuff and GitHub for community feature<br>
The problem is GitLab is not such community friendly and GitHub pipeline is too basic for WebDB.

Anyway, if you planned to push changement, I would prefer that you use GitLab's repo instead of GitHub please

### Requirements

- node >= 16
- git
- linux / macOS environment (for Windows users, developing inside a container will be the only option)

### Optional

- native DBMS binaries like the ones of `apk add` from [Dockerfile](back%2FDockerfile) (mysql, pgsql, etc)
- docker (for compatibility tests)

##### Setup

```
git clone git@gitlab.com:web-db/app.git && cd app

cd back && npm i && cd ..
cd front && pnpm i && cd ..
```

##### Run App

```
cd back && npm run dev:back
```

```
cd front && npm run dev:front
```

- Front app is available at http://localhost:4200

##### Databases Server

```
cd static && docker compose up -d
```

#### Dataset

You can found the world dataset sample on the [demo](https://demo.webdb.app) or [here](./static/)

Here is other sample dataset

- https://github.com/morenoh149/postgresDBSamples.git
- https://github.com/neelabalan/mongodb-sample-dataset.git
- https://github.com/enzinier/mysql-samples.git

If you found good one for testing, don't hesitate to propose them

### Commit strategy

- Please make a merge request for contribution between your branch and main
- Git log is used to generate changelog so please use exhaustive and simple commit message (LLM are your friend)
