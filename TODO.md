# Doc
- numérotation de version + cycle de dev + ci/cd
- nosql default column
- gpt4
- expliquer code .js, .ts
- https://chat.openai.com/c/eae4f88e-e100-45de-9502-8708f7f48bf8



- edit complex

- query stats -> network, execution
- finir tests
- ERD [Chrome bookmarks] + UML/Merise + draw named zones
- download/toClipboard git patch 


----------------------------------------------------------



# modules payant
- system de téléchargement de code depuis la landing avec le mail
- attention de telecharger la version par rapport a la version en cours
- récupérer la licence directemnt depuis la landing + enlever l'endpoint



# reorder columns


# Comparator
- Generate script to migrate + opt to run it
- https://documentation.red-gate.com/flyway/quickstart-how-flyway-works
- pgAdmin
- https://dbconvert.com/dbconvert-studio


# SQL editor
- https://demo.questdb.io/?query=--%20Compute%20the%20average%20gas%20price%20per%20gallon%20in%20one-month%20intervals.%20We%20use%20the%20SAMPLE%20BY%0A--%20SQL%20extension%20to%20aggregate%20records%20at%20regular%20intervals.%20This%20query%20covers%20a%20small%20demo%0A--%20dataset%20(1%2C028%20records)%20with%20historical%20gas%20prices.%0ASELECT%20timestamp%2C%20avg(galon_price)%0AFROM%20gas_prices%0ASAMPLE%20BY%201M%3B&executeQuery=true
- first level keyword (select, update, create, with) + patch
- comprendre les columns retournées par les cte et subquery 
- function doc (generate from web scrap)
- LLM on WebGPU ?
- handle subquery and cte like table (propose column from)


# Profiling
- https://github.com/dalibo/pev2
- https://www.postgresql.org/docs/9.2/using-explain.html
- https://www.mongodb.com/docs/manual/reference/command/explain/
- https://www.mongodb.com/docs/manual/tutorial/manage-the-database-profiler/
- https://easyengine.io/tutorials/mysql/query-profiling/
- https://dev.mysql.com/doc/refman/8.0/en/explain.html
- https://www.postgresql.org/docs/current/sql-explain.html
- https://mariadb.com/kb/en/explain-format-json/


# Advanced auth 
- tunnel passphrase ?
- cloud (google sql / atlas / rds / aurora)
- afficher comme serveur supporté dans la landing avec le page ultimate
- tls
- SCRAM, X.509, Kerberos, LDAP, proxy
- ssl-mode: DISABLED PREFERRED REQUIRED VERIFY_CA VERIFY_IDENTITY


# Relation wizard
- 1,1 -> 0,n
- 0,n -> 1,1
- 1,1 -> []
- 1,1 -> {}
- {} -> []
- {} -> 1,1
- show migration queries


# Mongo
- free: relation avec array: l427 mongodb.js
- https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#use--lookup-with-an-array
- columns with array > 2 : harmonize to one of the type (attention deep)
- obj column update
- harmonizer obj > 2


# Refaire list des features payantes dans stripe
