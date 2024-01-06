import {MongoClient} from 'mongodb';
import countries from './countries.js';
import cities from "./cities.json" assert {type: "json"};

const client = new MongoClient("mongodb://root:notSecureChangeMe@127.0.0.1:27017/?serverSelectionTimeoutMS=2000&authSource=admin", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});
const dbName = 'world';

await client.connect();

async function populateCountries() {
	const db = client.db(dbName);
	const continentCollection = db.collection('continent');
	const countryCollection = db.collection('country');
	const currencyCollection = db.collection('currency');
	const currencyCountryCollection = db.collection('currency_country');
	const languageCollection = db.collection('language');
	const languageCountryCollection = db.collection('language_country');

	for (const country of Object.values(countries)) {
		let rowContinent = await continentCollection.findOne({name: country.continent});

		if (!rowContinent) {
			rowContinent = await continentCollection.insertOne({name: country.continent});
			rowContinent = {id: rowContinent.insertedId};
		} else {
			rowContinent.id = rowContinent._id;
		}

		const continentId = rowContinent.id;

		let rowCountry = await countryCollection.findOne({name: country.name});

		if (!rowCountry) {
			rowCountry = await countryCollection.insertOne({
				name: country.name,
				native: country.native,
				phone: country.phone,
				continent_id: continentId,
				capital: country.capital,
			});
			rowCountry = {id: rowCountry.insertedId};
		} else {
			rowCountry.id = rowCountry._id;
		}

		const countryId = rowCountry.id;

		for (const currency of country.currency) {
			let rowCurrency = await currencyCollection.findOne({name: currency});

			if (!rowCurrency) {
				rowCurrency = await currencyCollection.insertOne({name: currency});
				rowCurrency = {id: rowCurrency.insertedId};
			} else {
				rowCurrency.id = rowCurrency._id;
			}

			const currencyId = rowCurrency.id;

			let rowCurrencyCountry = await currencyCountryCollection.findOne({
				id_currency: currencyId,
				id_country: countryId,
			});

			if (!rowCurrencyCountry) {
				await currencyCountryCollection.insertOne({id_currency: currencyId, id_country: countryId});
			}
		}

		for (const language of country.languages) {
			let rowLanguage = await languageCollection.findOne({name: language});

			if (!rowLanguage) {
				rowLanguage = await languageCollection.insertOne({name: language});
				rowLanguage = {id: rowLanguage.insertedId};
			} else {
				rowLanguage.id = rowLanguage._id;
			}

			const languageId = rowLanguage.id;

			let rowLanguageCountry = await languageCountryCollection.findOne({
				id_language: languageId,
				id_country: countryId,
			});

			if (!rowLanguageCountry) {
				await languageCountryCollection.insertOne({id_language: languageId, id_country: countryId});
			}
		}
	}
}

async function populateCities() {
	const db = client.db(dbName);
	const countryCollection = db.collection('country');
	const regionCollection = db.collection('region');
	const cityCollection = db.collection('city');
	const countriesDB = await countryCollection.find({}).toArray();
	const regionsDB = await regionCollection.find({}).toArray();

	const toInsert = [];

	for (const city of Object.values(cities)) {
		const regionCode = city.admin1 && city.admin2 ? `${city.country}.${city.admin1}.${city.admin2}` : null;
		const region = regionCode ? regionsDB.find((region) => region.code === regionCode) : null;
		const country = countriesDB.find((country) => country.name === countries[city.country].name);
		toInsert.push({
			name: city.name,
			lat: city.lat,
			lng: city.lng,
			country_id: country._id,
			region_code: region ? region.code : null,
		});
	}

	await cityCollection.insertMany(toInsert);
}

(async () => {
	try {
		//await populateCountries();
		await populateCities();
	} finally {
		await client.close();
	}
})();
