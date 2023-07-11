#!/bin/bash

#npm i -g dts-bundle-generator

cd ./node_modules/mongodb/ && dts-bundle-generator ./mongodb.d.ts && cp -fr mongodb.d.d.ts ../../../../../src/assets/libs/mongo.d.ts

cd ./node_modules/bson/ && dts-bundle-generator ./bson.d.ts && cp -fr bson.d.d.ts ../../../../../src/assets/libs/bson.d.ts

cd ./node_modules/@faker-js/faker && dts-bundle-generator --no-check ./dist/types/index.d.ts --external-inlines=@faker-js/faker && cp -fr ./dist/types/index.d.d.ts ../../../../../../src/assets/libs/faker.d.ts
