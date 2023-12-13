# WebDB – Open Source and Efficient Database IDE

| 🌍                            | 🐛                                                                 | 📙                                           | 🐳                                                | 💼                                                  |
|-------------------------------|--------------------------------------------------------------------|----------------------------------------------|---------------------------------------------------|-----------------------------------------------------|
| [Website](https://webdb.app/) | [Issue Tracker / Proposal](https://gitlab.com/web-db/app/-/issues) | [Wiki](https://gitlab.com/web-db/-/app/home) | [Docker Hub](https://hub.docker.com/r/webdb/app/) | [LinkedIn](https://www.linkedin.com/company/web-db) |

### Regular installation

[🐳 Standalone](https://webdb.app/page/install/standalone)

[🐳 Compose](https://webdb.app/page/install/compose)

### Development

[👨‍💻 Contributing](CONTRIBUTING.md)

### TODO

- cloud (google sql / atlas / rds / aurora) + afficher dans la landing + tls ?
- ERD [Chrome bookmarks]

----------------------------------------------------------

##### modules payant

- ml + new feature
- system de téléchargement de code depuis la landing avec le mail
- récupérer la licence directemnt depuis la landing + enlever l'endpoint

##### IA

- https://huggingface.co/TheBloke/zephyr-7B-alpha-GGUF/blob/main/README.md
- [Chrome bookmarks]
- codellama
- ml pruning
- https://huggingface.co/datasets/b-mc2/sql-create-context/viewer/default/train?p=1
- https://horde.koboldai.net/ https://github.com/bigscience-workshop/petals https://blog.cloudflare.com/fr-fr/workers-ai-fr-fr/
- tester create/update functions/procedure/check
- interactive ai
- Export Query : tester existant
- Sequelize
- Mongoose
- Native
- Stripe Metadata additionnal feature

##### Relation wizard

- 1,1 -> 0,n
- 0,n -> 1,1
- 1,1 -> []
- 1,1 -> {}
- {} -> []
- {} -> 1,1
- show migration queries

##### Mongo

- https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#use--lookup-with-an-array
- columns with array > 2 : harmonize to one of the type (attention deep)
- obj column update
- harmonizer obj > 2

##### Other

- sql function doc (generate from web scrap)
- virtual columns
