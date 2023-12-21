import mysql from "mysql2/promise.js";
import countries from "./countries.js";
import cities from "./cities.json" assert { type: "json" };

const connection = await mysql.createConnection({
	user: 'root',
	host: '127.0.0.1',
	password: 'notSecureChangeMe',
	port: '3307',
	database: 'world'
});

async function populate_countries() {
	for (const country of Object.values(countries)) {

		let [rowContinent] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
		if (rowContinent.length < 1) {
			await connection.execute(`INSERT INTO continent (name) VALUES (?)`, [country.continent]);
			[rowContinent] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
		}
		const continentId = rowContinent[0]['id'];


		let [rowCountry] = await connection.execute(`SELECT id FROM country WHERE name = ?`, [country.name]);
		if (rowCountry.length < 1) {
			await connection.execute(`INSERT INTO country (name, native, phone, continent_id, capital) VALUES ( ?, ?, ?, ?, ? )`, [country.name, country.native, country.phone[0], continentId, country.capital]);
			[rowCountry] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
		}
		const countryId = rowCountry[0]['id'];



		for (const currency of country.currency) {
			let [rowCurrency] = await connection.execute(`SELECT id FROM currency WHERE name = ?`, [currency]);
			if (rowCurrency.length < 1) {
				await connection.execute(`INSERT INTO currency (name) VALUES (?)`, [currency]);
				[rowCurrency] = await connection.execute(`SELECT id FROM currency WHERE name = ?`, [currency]);
			}
			const currencyId = rowCurrency[0]['id'];


			let [rowCurrencyCountry] = await connection.execute(`SELECT * FROM currency_country WHERE id_currency = ? and id_country = ?`, [currencyId, countryId]);
			if (rowCurrencyCountry.length < 1) {
				await connection.execute(`INSERT INTO currency_country (id_currency, id_country) VALUES (?, ?)`, [currencyId, countryId]);
			}
		}

		for (const language of country.languages) {
			let [rowLanguage] = await connection.execute(`SELECT id FROM language WHERE name = ?`, [language]);
			if (rowLanguage.length < 1) {
				await connection.execute(`INSERT INTO language (name) VALUES (?)`, [language]);
				[rowLanguage] = await connection.execute(`SELECT id FROM language WHERE name = ?`, [language]);
			}
			const languageId = rowLanguage[0]['id'];


			let [rowLanguageCountry] = await connection.execute(`SELECT * FROM language_country WHERE id_language = ? and id_country = ?`, [languageId, countryId]);
			if (rowLanguageCountry.length < 1) {
				await connection.execute(`INSERT INTO language_country (id_language, id_country) VALUES (?, ?)`, [languageId, countryId]);
			}
		}
	}
}

async function populate_cities() {

	for (const city of Object.values(cities)) {
		const regionCode = city.admin1 && city.admin2 ? city.country + '.' + city.admin1 + '.' + city.admin2 : null;

		let [rowCountry] = await connection.execute(`SELECT id FROM country WHERE name = ?`, [countries[city.country].name]);

		let [rowCity] = await connection.execute(`SELECT name FROM city WHERE name = ?`, [city.name]);
		if (rowCity.length < 1) {
			await connection.execute(`INSERT INTO city (name, lat, lng, country_id, region_code) VALUES (?, ?, ?, ?, ?)`, [city.name, city.lat, city.lng, rowCountry[0]['id'], regionCode]);
		}
	}
}

await populate_cities();

await connection.end();
