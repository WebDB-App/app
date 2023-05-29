export class Relation {

	name!: string
	database_source!: string
	table_source!: string;
	column_source!: string;
	database_dest!: string
	table_dest!: string;
	column_dest!: string;
	update_rule!: string;
	delete_rule!: string;
}
