# Welcome to WebDB App

## Links
- [Issue Tracker](https://gitlab.com/web-db/app/-/issues)
- [Wiki](https://gitlab.com/web-db/-/app/home)
- [LinkedIn](https://www.linkedin.com/company/web-db)
- [AlternativeTo](https://alternativeto.net/software/webdb-app/about/)
- [Website](https://webdb.app/)


## Development

##### Requirements
- node >= 16
- docker (highly recommended)
- git

##### Setup
- git clone git@gitlab.com:web-db/app.git && cd app
- cd back/src/shared && ln -s ../../../common-helper.mjs ./ && npm i && npm run dev:back
- cd front/src/shared && ln -s ../../../common-helper.mjs ./ && pnpm i && npm run dev:front
- go to http://localhost:4200

You can then create your database or import from submodules with 
``` git submodule update --init --recursive ```.<br>
Once done, you can pick up in dataset folder.<br>
If you found good datasets for testing, don't hesite to propose them also

##### Merge request
- Please make a merge request for contribution between your branch and dev
- Git log is used to generate changelog so please use gitmoji or explicit commit message.
