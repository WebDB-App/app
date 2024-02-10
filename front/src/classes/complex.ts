export class Complex {
	name!: string;
	database!: string;
	table?: string;
	column?: string;
	value?: string;
}

export class EditableComplex extends Complex {
	hide?: boolean;
	newName?: string;
	rename = false;
}
