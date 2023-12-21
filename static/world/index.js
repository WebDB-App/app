import mysql from "mysql2/promise.js";
import countries from "./countries.js";
import cities from "./cities.json" assert { type: "json" };
import admin2 from "./admin2.json" assert { type: "json" };

const connection = await mysql.createConnection({
	user: 'root',
	host: '127.0.0.1',
	password: 'notSecureChangeMe',
	port: '3307',
	database: 'world'
});

for (const country of Object.values(countries)) {
	/*
	name: 'Andorra',
    native: 'Andorra',
    phone: [376],
    continent: 'EU',
    capital: 'Andorra la Vella',
    currency: ['EUR'],
    languages: ['ca'],
	 */

	let [rowContinent] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
	if (rowContinent.length < 1) {
		await connection.execute(`INSERT INTO continent (name) VALUES (?)`, [country.continent]);
		[rowContinent] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
	}
	const continentId = rowContinent[0]['id'];


	let [rowCountry] = await connection.execute(`SELECT id FROM country WHERE name = ?`, [country.name]);
	if (rowCountry.length < 1) {
		await connection.execute(`INSERT INTO country (name) VALUES (?)`, [country.continent]);
		[rowCountry] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
	}
	const countryId = rowCountry[0]['id'];

	INSERT INTO country (name, native, phone, continent, capital) VALUES ( name = 'varchar(250)', native = 'longtext', phone = 'int', continent = 'int', capital = 'varchar(250)' )



	/*
	for (const currency of country.currency) {

	}


	let [rowCurrency] = await connection.execute(`SELECT id FROM currency WHERE name = ?`, [country.currency]);
	if (rowCurrency.length < 1) {
		await connection.execute(`INSERT INTO continent (name) VALUES (?)`, [country.continent]);
		[rowCurrency] = await connection.execute(`SELECT id FROM continent WHERE name = ?`, [country.continent]);
	}
	const currencyId = rowCurrency[0]['id'];
	 */
}


