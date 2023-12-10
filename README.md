# WebDB – Open Source and Efficient Database IDE

| 🌍 | 🐛 | 📙 | 🐳 | 💼 |
|--|--|--|--|--|
| [Website](https://webdb.app/) | [Issue Tracker / Proposal](https://gitlab.com/web-db/app/-/issues) | [Wiki](https://gitlab.com/web-db/-/app/home) | [Docker Hub](https://hub.docker.com/r/webdb/app/) | [LinkedIn](https://www.linkedin.com/company/web-db) |

## Development

##### Requirements
- node >= 16
- docker (highly recommended)
- git

##### Setup
```
git clone git@gitlab.com:web-db/app.git && cd app

cd back/src/shared && ln -s ../../../common-helper.cjs ./ ; npm i && cd ....
cd front/src/shared && ln -s ../../../common-helper.cjs ./ ; pnpm i && cd ....
```

##### Run
```
cd back && npm run dev:back && cd ..
cd front && npm run dev:front && cd ..
```

- Open http://localhost:4200

You can then create your database or import from submodules with 
``` git submodule update --init --recursive ```.<br>
Once done, you can pick up in dataset folder.<br>
If you found good datasets for testing, don't hesite to propose them also

##### Contributing
- Please make a merge request for contribution between your branch and main
- Git log is used to generate changelog so please use gitmoji and explicit commit message.

## TODO

[💻 Technical](tech.md)

[💬 Communication](com.md)
