import { Component, OnInit } from '@angular/core';
import { Server } from "../../../classes/server";
import { Database } from "../../../classes/database";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent implements OnInit {

	selectedServer?: Server;
	selectedDatabase?: Database;

	constructor(
		public snackBar: MatSnackBar
	) {	}

	ngOnInit(): void {
		this.selectedDatabase = Database.getSelected();
		this.selectedServer = Server.getSelected();

	}

	filterChanged(_value = '') {
		/*const value = _value.toLowerCase();
		for (const [index, msg] of this.chat.entries()) {
			let founded = msg.txt.toLowerCase().indexOf(value) >= 0;
			if (!founded && msg.marked) {
				founded = msg.marked?.findIndex(mark => {
					return mark.code ? mark.code.toLowerCase().indexOf(value) >= 0 : false;
				}) >= 0;
			}

			this.chat[index].hide = !founded;
		}*/
	}
}


/*
ctrl/cmd z shortcut -> open panel

- Checksum par table
- https://stackoverflow.com/questions/17177914/is-there-a-more-elegant-way-to-detect-changes-in-a-large-sql-table-without-alter#comment24874308_17178078
- https://www.tutorialspoint.com/mysql/mysql_checksum_table_statement.htm
- https://www.google.com/search?q=mongo+watch+databasr&oq=mongo+watch+databasr&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIJCAEQIRgKGKAB0gEJMTM3MDVqMGo0qAIAsAIA&client=ms-android-google&sourceid=chrome-mobile&ie=UTF-8
- https://github.com/debezium/debezium
 */
