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

You can then create your database or import from submodules with
``` git submodule update --init --recursive ```.<br>
Once done, you can pick up in dataset folder.<br>
If you found good datasets for testing, don't hesitate to propose them also

### Commit strategy

- Please make a merge request for contribution between your branch and main
- Git log is used to generate changelog so please use exhaustive and simple commit message (LLM are your friend)
