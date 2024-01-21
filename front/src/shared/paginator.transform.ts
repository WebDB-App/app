import {Injectable} from '@angular/core';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {Subject} from 'rxjs';

@Injectable()
export class CustomPaginatorIntl implements MatPaginatorIntl {
	changes = new Subject<void>();

	firstPageLabel = `First page`;
	itemsPerPageLabel = `Items per page:`;
	lastPageLabel = `Last page`;
	nextPageLabel = '';
	previousPageLabel = '';

	getRangeLabel(page: number, pageSize: number, length: number): string {
		if (length === 0 || pageSize === 0) {
			return "";
		}
		length = Math.max(length, 0);
		const startIndex = page * pageSize;
		const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

		const l = length.toLocaleString();
		const s = (startIndex + 1).toLocaleString();
		const e = endIndex.toLocaleString();
		return `${s} – ${e} of ${l}`;
	}
}
