import {describe, test} from "node:test"
import {post} from "./api.js";
import assert from "node:assert";
import {runWebDB} from "./helper.js";

runWebDB();

await describe('webdb:app', async () => {
	const request = await post(`subscription/parse`, {
		privateKey: "====BEGIN LICENSE KEY====\ntVSIfKTzC26pHc8HTAK0QxAtVslNE4FTL8EjCPTMPMrR/PX2k58ukjsz/L+qeSBjkp8snCemuuIv7xyk+/brNpoNOrBhUvaNgfTsXJvSotYGeAW1JDQ/682zuNh7BmOkiavWTykFh0GovJrZlKBTkHZq7QN8VVmE6Qzpm+FUAVe41akGEiCj1/9E5BBnT8FQ58E0UuBOkh8kfEQ2JAe335Qao3TTismZioEohF/JFqZk1rmBIlfKTVXUPH60EbnS16J0hsjtVy61tHPOWLXNkftUs6sdLpr9V2VEdgAYi2298LWgtWf5jKs8fneyubTp2nlzlULsaYf8Qmg9ya7+3w==||U2FsdGVkX1+2JAbRHqqZ+/6deuWU78Ky2rnFT577GC1Xya3vXrvBNOmWr6RJ7M34szui80G3/7Koh5/NOg2p4reYWEg0KiK+SKVnrUU+Z9uhs59S3bxa/VCkUjqw3s4R\ndqckdzsmW46/bjqYN82jqcbCSQmCcdgopbgwLl7CcvtbKHhWK9aEua88e/B7pzBzPoLn7P6u8U3EopV6uLb2jLhhFIOA5PyIfEuv3kXmJv9jA0UDAXgB+VmJAjWz2JqxcZcFw9PF63iQBRjbPO5dofT4tx4TJSc/D/GyqR3rdjeN5oWdDfSeGbtuaLpdv9AqPs/z28fYYoaBc5ZSB688r4MbVXja/2nTAIDDyIAabf3hfAmbzaUonaycPywfNHmDVhrQlSq4EatSTMiOMWqZrQkezZ3a8IqXv++PxS8VHp0GPDXFUzB4Buk6sVK4Zd3svHwnBKQ50o4JsscnMhsZLw==\n====END LICENSE KEY===="
	});

	const keysPresent = request.hasOwnProperty("expire") && request.hasOwnProperty("plan");
	await test('[licence] Parse succeed', async () => {
		assert.ok(keysPresent);
	});
	if (!keysPresent) {
		throw new Error("Licence problem");
	}

	//--------------------------------------------


	const logs = await (await fetch("http://localhost:22070/logs/finished.log", {
		"method": "GET",
	})).text();
	await test('[monitoring] Finished queries list ok', async () => {
		assert.ok(logs.length > 0);
	});


	//--------------------------------------------


});
