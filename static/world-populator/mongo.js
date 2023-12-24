import pg from "pg";
import countries from './countries.js';
import cities from './cities.json' assert { type: 'json' };
import regions from './admin2.json' assert { type: 'json' };

const pool = new pg.Pool({
	user: 'root',
	host: 'localhost',
	database: 'world',
	password: 'notSecureChangeMe',
	port: 5432,
});

async function populate_countries() {
	const client = await pool.connect();
	try {
		for (const country of Object.values(countries)) {
			let res = await client.query('SELECT id FROM continent WHERE name = $1', [country.continent]);
			let rowContinent = res.rows[0];

			if (!rowContinent) {
				await client.query('INSERT INTO continent (name) VALUES ($1)', [country.continent]);
				res = await client.query('SELECT id FROM continent WHERE name = $1', [country.continent]);
				rowContinent = res.rows[0];
			}
			const continentId = rowContinent.id;

			res = await client.query('SELECT id FROM country WHERE name = $1', [country.name]);
			let rowCountry = res.rows[0];

			if (!rowCountry) {
				await client.query('INSERT INTO country (name, native, phone, continent_id, capital) VALUES ($1, $2, $3, $4, $5)', [
					country.name,
					country.native,
					country.phone[0],
					continentId,
					country.capital,
				]);
				res = await client.query('SELECT id FROM country WHERE name = $1', [country.name]);
				rowCountry = res.rows[0];
			}
			const countryId = rowCountry.id;

			for (const currency of country.currency) {
				res = await client.query('SELECT id FROM currency WHERE name = $1', [currency]);
				let rowCurrency = res.rows[0];

				if (!rowCurrency) {
					await client.query('INSERT INTO currency (name) VALUES ($1)', [currency]);
					res = await client.query('SELECT id FROM currency WHERE name = $1', [currency]);
					rowCurrency = res.rows[0];
				}
				const currencyId = rowCurrency.id;

				res = await client.query('SELECT * FROM currency_country WHERE id_currency = $1 and id_country = $2', [currencyId, countryId]);
				let rowCurrencyCountry = res.rows[0];

				if (!rowCurrencyCountry) {
					await client.query('INSERT INTO currency_country (id_currency, id_country) VALUES ($1, $2)', [currencyId, countryId]);
				}
			}

			for (const language of country.languages) {
				res = await client.query('SELECT id FROM language WHERE name = $1', [language]);
				let rowLanguage = res.rows[0];

				if (!rowLanguage) {
					await client.query('INSERT INTO language (name) VALUES ($1)', [language]);
					res = await client.query('SELECT id FROM language WHERE name = $1', [language]);
					rowLanguage = res.rows[0];
				}
				const languageId = rowLanguage.id;

				res = await client.query('SELECT * FROM language_country WHERE id_language = $1 and id_country = $2', [languageId, countryId]);
				let rowLanguageCountry = res.rows[0];

				if (!rowLanguageCountry) {
					await client.query('INSERT INTO language_country (id_language, id_country) VALUES ($1, $2)', [languageId, countryId]);
				}
			}
		}
	} finally {
		client.release();
	}
}

async function populate_regions() {
	const client = await pool.connect();
	try {
		const to_insert = [];
		for (const region of regions) {
			to_insert.push(client.query({
				text: 'INSERT INTO region (code, name) VALUES ($1, $2)',
				values: [region.code, region.name],
			}));
		}

		await Promise.all(to_insert);
	} finally {
		client.release();
	}
}

async function populate_cities() {
	const client = await pool.connect();
	try {
		const resCountries = await client.query('SELECT * FROM country');
		const resRegions = await client.query('SELECT * FROM region');
		const countriesDB = resCountries.rows;
		const regionsDB = resRegions.rows;
		const to_insert = [];

		for (const city of Object.values(cities)) {
			const regionCode = city.admin1 && city.admin2 ? city.country + '.' + city.admin1 + '.' + city.admin2 : null;
			const region = regionCode ? regionsDB.find(region => region.code === regionCode) : null;
			const country = countriesDB.find(country => country.name === countries[city.country].name);
			to_insert.push(client.query({
				text: 'INSERT INTO city (name, lat, lng, country_id, region_code) VALUES ($1, $2, $3, $4, $5)',
				values: [city.name, city.lat, city.lng, country.id, region ? region.code : null],
			}));
		}

		await Promise.all(to_insert);
	} finally {
		client.release();
	}
}

try {
	await populate_countries();
	await populate_regions();
	await populate_cities();
} finally {
	await pool.end();
}
