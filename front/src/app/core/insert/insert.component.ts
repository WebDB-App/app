import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { Table } from "../../../classes/table";
import jsbeautifier from "js-beautify";
import * as cryptojs from "crypto-js";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RequestService } from "../../../shared/request.service";
import { combineLatest, distinctUntilChanged, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { TypeName } from 'src/classes/driver';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";

const localStorageName = "codes";

interface SelectGroup {
	name: string;
	values: {
		name: string,
		type: TypeName[];
		fct: string
	}[];
}

@Component({
	selector: 'app-insert',
	templateUrl: './insert.component.html',
	styleUrls: ['./insert.component.scss']
})
export class InsertComponent implements OnInit, OnDestroy {

	selectedServer?: Server;
	selectedDatabase?: Database;
	selectedTable?: Table;
	columns?: string[];
	structure: any = {};
	obs: Subscription;

	editorOptions = {
		lineNumbers: 'off',
		glyphMargin: false,
		folding: false,
		lineDecorationsWidth: 2,
		lineNumbersMinChars: 0,
		language: 'javascript'
	};

	actionColum = "##ACTION##";
	dataSource: MatTableDataSource<any> = new MatTableDataSource();
	randomSource?: MatTableDataSource<any>;
	selection = new SelectionModel<any>(true, []);
	displayedColumns?: string[];

	interval?: NodeJS.Timer;
	codes: any = JSON.parse(localStorage.getItem(localStorageName) || "{}");
	selectGroups: SelectGroup[] = [
		{
			name: 'ID',
			values: [
				{
					name: "UUID",
					type: [TypeName.String],
					fct: "(() => {return crypto.randomUUID()})()"
				},
				{
					name: "ObjectID",
					type: [TypeName.String],
					fct: "(() => {return Math.floor(new Date().getTime() / 1000).toString(16) + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => Math.floor(Math.random() * 16).toString(16) ).toLowerCase();})()"
				}
			],
		}, {
			name: 'Primitive',
			values: [
				{
					name: "True / False",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.random() < 0.5})()"
				},
				{
					name: "Float(0, 1)",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.random()})()"
				},
				{
					name: "Float(-1000000, 1000000)",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.random() * (1000000 - -1000000) + -1000000})()"
				},
				{
					name: "Integer(0, 10)",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 10)})()"
				},
				{
					name: "Integer(-100000, 100000)",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * (1000000 - -1000000) + -1000000)})()"
				},
				{
					name: "Alphanumeric(0, 10)",
					type: [TypeName.String],
					fct: "(() => {return [...Array(Math.floor(Math.random() * 10))].map(() => Math.random().toString(36)[2]).join('')})()"
				},
				{
					name: "Null",
					type: [TypeName.Date, TypeName.Numeric, TypeName.Other, TypeName.String],
					fct: "(() => {return null})()"
				}
			],
		}, {
			name: 'Name',
			values: [
				{
					name: "First Name",
					type: [TypeName.String],
					fct: '(() => {const names = ["Jacob","Michael","Ethan","Joshua","Daniel","Alexander","Chloe","Samantha","Addison","Natalie","Mia","Alexis","Alyssa","Hannah","Ashley","Ella","Sarah","Grace","Taylor"];return names[Math.floor(Math.random() * (names.length))]})()'
				},
				{
					name: "Last Name",
					type: [TypeName.String],
					fct: '(() => {const names = ["Smith","Johnson","Williams","Brown","Jones","Miller","Davis","John","Doe","Jackson","Jordan","Lopez","Martin","Rousse","Bellanger","Maunier","Lopez","Robert","Dupont"];return names[Math.floor(Math.random() * (names.length))]})()'
				},
			],
		}, {
			name: 'Email',
			values: [
				{
					name: "Email",
					type: [TypeName.String],
					fct: '(() => {const email = ["tattooman","rasca","hikoza","arachne","rgarcia","russotto","nicktrig","martink","mnemonic","luvirini","ingolfke","sbmrjbr","chaki","dobey","retoh","mavilar"]; const domain = ["gmail.com","yahoo.com","aol.com","hotmail.com","ootlook.com","ootlook.fr","orange.fr"]; return email[Math.floor(Math.random() * email.length)] + "@" + domain[Math.floor(Math.random() * domain.length)]})()'
				},
			],
		}, {
			name: 'Password',
			values: [
				{
					name: "SHA1('password')",
					type: [TypeName.String],
					fct: "(() => {return return cryptojs.SHA1('password')})()"
				},
				{
					name: "SHA256('password')",
					type: [TypeName.String],
					fct: "(() => {return cryptojs.SHA256('password')})()"
				},
				{
					name: "SHA256('password', 'salt')",
					type: [TypeName.String],
					fct: "(() => {return cryptojs.SHA256(cryptojs.SHA256('password') + 'salt')})()"
				}
			],
		}, {
			name: 'Date',
			values: [
				{
					name: "Timestamp (in milliseconds)",
					type: [TypeName.Date],
					fct: "(() => {return Math.floor(Math.random() * 1e+12)})()"
				},
				{
					name: "Year-Day-Month",
					type: [TypeName.Date],
					fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toISOString().split('T')[0]})()"
				},
				{
					name: "Year-Day-Month Hour:Minute:Second",
					type: [TypeName.Date],
					fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toISOString()})()"
				},
				{
					name: "Day/Month/Year",
					type: [TypeName.Date],
					fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toLocaleDateString('fr-FR')})()"
				},
				{
					name: "Day/Month/Year Hour:Minute:Second",
					type: [TypeName.Date],
					fct: "(() => {return (new Date(+(new Date()) - Math.floor(Math.random() * 1e+12))).toLocaleString('fr-FR')})()"
				},
				{
					name: "Year",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 2500) + 1800})()"
				},
				{
					name: "Month",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 12) + 1})()"
				},
				{
					name: "Day",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 32) + 1})()"
				},
				{
					name: "Hour",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 24)})()"
				},
				{
					name: "Minute",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 60)})()"
				},
				{
					name: "Second",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 60)})()"
				},
				{
					name: "Millisecond",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 1000)})()"
				}
			],
		}, {
			name: 'Address',
			values: [
				{
					name: "Full Address",
					type: [TypeName.String],
					fct: "(() => {var streetNumber = ['25489', '87459', '35478', '15975', '95125', '78965'] var streetName = ['A street', 'B street', 'C street', 'D street', 'E street', 'F street',] var cityName = ['Riyadh', 'Dammam', 'Jedda', 'Tabouk', 'Makka', 'Maddena', 'Haiel'] var stateName = ['Qassem State', 'North State', 'East State', 'South State', 'West State'] var zipCode = ['28889', '96459', '35748', '15005', '99625', '71465'] function getRandom(input) { return input[Math.floor((Math.random() * input.length))]; }; return `${getRandom(streetNumber)} ${getRandom(streetName)} ${getRandom(cityName)} ${getRandom(stateName)} ${getRandom(zipCode)}`;})()"
				},
				{
					name: "Street Number",
					type: [TypeName.String],
					fct: "(() => {return Math.floor(Math.random() * 1000) + 1})()"
				},
				{
					name: "Street Name",
					type: [TypeName.String],
					fct: '(() => {const names = ["Arlington Avenue", "Andover Court", "Windsor Drive", "Atlantic Avenue", "Cottage Street", "Arlington Avenue", "Charles Street", "Grand Avenue", "Ann Street", "Main Street", "Jefferson Avenue"];return names[Math.floor(Math.random() * (names.length))]})()'
				},
				{
					name: "City",
					type: [TypeName.String],
					fct: '(() => {const names = ["New York", "Los Angeles", "Chicago", "Houston", "Philadelphia", "Phoenix", "San Diego", "San Antonio", "Dallas", "Detroit", "San Jose", "Indianapolis", "Jacksonville", "San Francisco", "Columbus", "Austin", "Memphis", "Baltimore", "Charlotte", "Fort Worth", "Boston", "Milwaukee", "El Paso", "Washington", "Nashville-Davidson", "Seattle", "Denver", "Las Vegas", "Portland", "Oklahoma City", "Tucson", "Albuquerque", "Atlanta", "Long Beach", "Kansas City", "Fresno", "New Orleans", "Cleveland", "Sacramento", "Mesa", "Virginia Beach", "Omaha", "Colorado Springs", "Oakland", "Miami", "Tulsa", "Minneapolis", "Honolulu", "Arlington", "Wichita", "St. Louis", "Raleigh", "Santa Ana", "Cincinnati", "Anaheim", "Tampa", "Toledo", "Pittsburgh", "Aurora", "Bakersfield", "Riverside", "Stockton", "Corpus Christi", "Lexington-Fayette", "Buffalo", "St. Paul", "Anchorage", "Newark", "Plano", "Fort Wayne", "St. Petersburg", "Glendale", "Lincoln", "Norfolk", "Jersey City", "Greensboro", "Chandler", "Birmingham", "Henderson", "Scottsdale", "North Hempstead", "Madison", "Hialeah", "Baton Rouge", "Chesapeake", "Orlando", "Lubbock", "Garland", "Akron", "Rochester", "Chula Vista", "Reno", "Laredo", "Durham", "Modesto", "Huntington", "Montgomery", "Boise", "Arlington", "San Bernardino"];return names[Math.floor(Math.random() * (names.length))]})()'
				},
				{
					name: "Postal Code",
					type: [TypeName.Numeric],
					fct: "(() => {return Math.floor(Math.random() * 100000) + 1})()"
				},
				{
					name: "Country",
					type: [TypeName.String],
					fct: '(() => {const country = ["Afghanistan", "Åland Islands", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia (Plurinational State of)", "Bonaire", "Bosnia and Herzegovina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo (Democratic Republic of the)", "Cook Islands", "Costa Rica", "Côte d\'Ivoire", "Croatia", "Cuba", "Curaçao", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guernsey", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard Island and McDonald Islands", "Holy See", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Isle of Man", "Israel", "Italy", "Jamaica", "Japan", "Jersey", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea (Democratic People\'s Republic of)", "Korea (Republic of)", "Kuwait", "Kyrgyzstan", "Lao People\'s Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macao", "Macedonia (the former Yugoslav Republic of)", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia (Federated States of)", "Moldova (Republic of)", "Monaco", "Mongolia", "Montenegro", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Réunion", "Romania", "Russian Federation", "Rwanda", "Saint Barthélemy", "Saint Helena", "Saint Kitts and Nevis", "Saint Lucia", "Saint Martin (French part)", "Saint Pierre and Miquelon", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Sint Maarten (Dutch part)", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Svalbard and Jan Mayen", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Republic of China", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom of Great Britain and Northern Ireland", "United States of America", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela (Bolivarian Republic of)", "Viet Nam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna", "Western Sahara", "Yemen", "Zambia", "Zimbabwe"]; return country[Math.floor(Math.random() * country.length)]})()'
				},
				{
					name: "Country Code (XX)",
					type: [TypeName.String],
					fct: '(() => {const country = ["AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ", "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ", "DK", "DJ", "DM", "DO", "EC", "EG", "SV", "GQ", "ER", "EE", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK", "HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI", "KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MK", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MP", "NO", "OM", "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RE", "RO", "RU", "RW", "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SZ", "SE", "CH", "SY", "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"]; return country[Math.floor(Math.random() * country.length)]})()'
				},
			],
		}, {
			name: 'Phone',
			values: [
				{
					name: "XXX-XXX-XXXX",
					type: [TypeName.String],
					fct: "(() => {return 'XXX-XXX-XXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
				},
				{
					name: "XX.XX.XX.XX.XX",
					type: [TypeName.String],
					fct: "(() => {return 'XX.XX.XX.XX.XX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
				},
				{
					name: "XXXXXXXXXX",
					type: [TypeName.Numeric],
					fct: "(() => {return 'XXXXXXXXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
				},
				{
					name: "XXXX-XXXX",
					type: [TypeName.String],
					fct: "(() => {return 'XXXX-XXXX'.replace(/[X]/g, () => Math.floor(Math.random() * 10))})()"
				}
			],
		}, {
			name: 'Lorem',
			values: [
				{
					name: "Few Words",
					type: [TypeName.String],
					fct: "(() => {const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut'];const result = [];for (var j = 0; j < Math.floor(Math.random() * 10); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(' ')})()"
				},
				{
					name: "Long text",
					type: [TypeName.String],
					fct: "(() => {const words = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut'];const result = [];for (var j = 0; j < Math.floor(Math.random() * 1000); j++) {  result.push(words[Math.floor(Math.random() * words.length)]) }return result.join(' ')})()"
				},
			]
		}, {
			name: 'Geolocation',
			values: [
				{
					name: "Latitude | Longitude",
					type: [TypeName.Numeric],
					fct: "(() => {return (Math.random() * (-360) + 180).toFixed(3)})()"
				},
			],
		}
	];

	constructor(
		private request: RequestService,
		private route: ActivatedRoute,
		private _snackBar: MatSnackBar) {

		this.obs = combineLatest([this.route.parent?.params, this.request.serverReload]).pipe(
			distinctUntilChanged()
		).subscribe(async (_params) => {
			this.dataSource = new MatTableDataSource();
			this.selection.clear();
			await this.ngOnInit();
		});
	}

	async ngOnInit() {
		this.selectedServer = Server.getSelected();
		this.selectedDatabase = Database.getSelected();
		this.selectedTable = Table.getSelected();
		const relations = Table.getRelations();
		const limit = 300

		this.columns = this.selectedTable?.columns.map(col => col.name)
		this.displayedColumns = [...this.columns!];
		this.displayedColumns!.push(this.actionColum);

		const select: any = {};
		const fct: any = {};
		const error: any = {};

		for (const col of this.columns!) {
			this.structure[col] = this.selectedTable?.columns.find(column => column.name === col)!.type;

			select[col] = '';
			fct[col] = this.beautify(this.getCode(col));
			error[col] = '';
		}

		for (const col of this.selectedTable!.columns) {
			const values = this.selectedServer!.driver.extractEnum(col);
			if (values) {
				fct[col.name] = `(() => {const enums = [${values.map(value => `'${value}'`).join(",")}];return enums[Math.floor(Math.random() * (enums.length))]})()`;
				fct[col.name] = this.beautify(fct[col.name]);
			} else if (relations.find(relation => relation.column_source === col.name)) {
				const datas = await this.request.post('relation/exampleData', {column: col.name, limit});
				if (datas) {
					fct[col.name] = `(() => {const fk = [${datas.map((data: any) => `'${data.example}'`).join(",")}];return fk[Math.floor(Math.random() * (fk.length))]})()`;
					fct[col.name] = this.beautify(fct[col.name]);
				}
			}
		}

		this.randomSource = new MatTableDataSource([select, fct, error]);
		this.interval = setInterval(() => this.saveCode(), 1000);
	}

	ngOnDestroy() {
		this.obs.unsubscribe();
		clearInterval(this.interval);
	}

	beautify(str: string) {
		return jsbeautifier.js_beautify(str);
	}

	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource.data.length;
		return numSelected === numRows;
	}

	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}

		this.selection.select(...this.dataSource.data);
	}

	addRows(length: number) {
		const obj: any = {};

		const newRows = Array.from({length}, (_, k) => obj);
		this.dataSource.data = this.dataSource.data.concat(newRows);
	}

	async insert() {
		const result = await this.request.post('data/insert', this.dataSource.data);

		this._snackBar.open(`${result.inserted} Affected Rows`, "╳", {duration: 3000});
	}

	removeRows() {
		this.dataSource.data = this.dataSource.data.filter((row) => {
			return !this.selection.isSelected(row);
		});

		this.selection.clear();
	}

	generate(nb: number) {
		for (let i = 0; i < nb; i++) {
			const random: any = {};
			for (const [index, fct] of Object.entries(this.randomSource?.data[1])) {
				try {
					random[index] = new Function("cryptojs", "return " + fct)(cryptojs);
					this.randomSource!.data[2][index] = "";
				} catch (e) {
					this.randomSource!.data[2][index] = e;
					return;
				}
			}
			this.dataSource.data = this.dataSource.data.concat(random);
		}
	}

	csvToJSON(csv: string) {
		const lines = csv.split("\n");
		const result = [];
		const headers = lines[0].split(",");

		for (let i = 1; i < lines.length; i++) {
			const obj: any = {};

			if (lines[i] == undefined || lines[i].trim() == "") {
				continue;
			}

			const words = lines[i].split(",");
			for (let j = 0; j < words.length; j++) {
				obj[headers[j].trim()] = words[j];
			}

			result.push(obj);
		}
		return result;
	}

	async inputChange(fileInputEvent: any) {
		if (!fileInputEvent.target.files) {
			return;
		}
		const file = (<FileList>fileInputEvent.target.files)[0];
		let data: any = await file.text();

		if (file.type === "application/json") {
			data = JSON.parse(data);
			if (!Array.isArray(data)) {
				for (const arr of Object.values(data)) {
					if (Array.isArray(arr)) {
						data = arr;
						break;
					}
				}
			}
		} else {
			data = this.csvToJSON(data);
		}
		if (!data || data.length < 1) {
			this._snackBar.open("File not compatible", "╳", {panelClass: 'snack-error'});
			return;
		}

		for (const da of data) {
			this.dataSource.data.push(da);
		}

		this.dataSource._updateChangeSubscription();
	}

	typeMatch(columnType: string, presetTypes: TypeName[]) {
		if (columnType.indexOf('(') >= 0) {
			columnType = columnType.substring(0, columnType.indexOf('('))
		}
		columnType = columnType.toLowerCase();

		for (const presetType of presetTypes) {
			const types = this.selectedServer!.driver.typesList.find(t => t.name === presetType)!.full;

			if (types.find(type => columnType === type)) {
				return true;
			}
		}

		return false;
	}

	saveCode() {
		for (const [index, fct] of Object.entries(this.randomSource?.data[1])) {
			this.codes[this.selectedDatabase!.name][this.selectedTable!.name][index] = fct;
		}

		localStorage.setItem(localStorageName, JSON.stringify(this.codes));
	}

	getCode(col: string) {
		this.codes[this.selectedDatabase!.name] = this.codes[this.selectedDatabase!.name] || {};
		this.codes[this.selectedDatabase!.name][this.selectedTable!.name] = this.codes[this.selectedDatabase!.name][this.selectedTable!.name] || {};

		if (this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col]) {
			return this.codes[this.selectedDatabase!.name][this.selectedTable!.name][col];
		}
		return '(() => {return undefined})()';
	}
}
