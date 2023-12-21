### Requirements

- node >= 16
- docker (highly recommended)
- git

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

You can found the world dataset sample on the [demo](https://demo.webdb.app) or [here](./static/world)

Here is other sample dataset
- https://github.com/morenoh149/postgresDBSamples.git
- https://github.com/neelabalan/mongodb-sample-dataset.git
- https://github.com/enzinier/mysql-samples.git

If you found good one for testing, don't hesitate to propose them

### Commit strategy

- Please make a merge request for contribution between your branch and main
- Git log is used to generate changelog so please use exhaustive and simple commit message (LLM are your friend)
