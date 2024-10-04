#!/bin/bash
#npm i -g dts-bundle-generator

cd front

rm -fr ./node_modules || echo
rm -fr pnpm-lock.yaml
pnpm i

(cd ./node_modules/mongodb/ && dts-bundle-generator ./mongodb.d.ts && cp -fr mongodb.d.d.ts ../../../../../src/assets/libs/mongo.d.ts)
(cd ./node_modules/bson/ && dts-bundle-generator ./bson.d.ts && cp -fr bson.d.d.ts ../../../../../src/assets/libs/bson.d.ts)

(cd ./node_modules/@ngneat/falso/ && dts-bundle-generator --no-check ./src/index.d.ts --external-inlines=@ngneat/falso && cp -fr ./src/index.d.d.ts ../../../../../../src/assets/libs/falso.d.ts)
(cd ./node_modules/@faker-js/faker/ && dts-bundle-generator --no-check ./dist/index.d.ts --external-inlines=@faker-js/faker && cp -fr ./dist/index.d.d.ts ../../../../../../src/assets/libs/faker.d.ts)

cd ../

###############


cd back
rm -fr ./node_modules || echo
rm -fr package-lock.json
npm i
cd ../

###############

cd compatibility
rm -fr ./node_modules || echo
rm -fr package-lock.json
npm i
cd ../

###############

cd static/world-populator
rm -fr ./node_modules || echo
rm -fr package-lock.json
npm i
cd ../../

###############
