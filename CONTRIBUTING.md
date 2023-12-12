##### Requirements
- node >= 16
- docker (highly recommended)
- git

##### Setup
```
git clone git@gitlab.com:web-db/app.git && cd app

cd back && npm i && cd ....
cd front && pnpm i && cd ....
```

##### Run App
```
cd back && npm run dev:back && cd ..
cd front && npm run dev:front && cd ..
```

##### Databases Server
```
cd composes && docker compose up -d
```

- Open http://localhost:4200

You can then create your database or import from submodules with
``` git submodule update --init --recursive ```.<br>
Once done, you can pick up in dataset folder.<br>
If you found good datasets for testing, don't hesitate to propose them also

##### Commit strategy
- Please make a merge request for contribution between your branch and main
- Git log is used to generate changelog so please use gitmoji and explicit commit message
