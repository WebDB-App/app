import { Directive, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, pipe, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Directive({
	selector: 'table[range-selection]',
})
export class RangeSelectionDirective {
	@Input() selectionClass = 'selected-cell';

	private keyPressed = false;
	private table: HTMLTableElement;
	private startCell: HTMLTableCellElement | null = null;
	private selecting: boolean = false;
	private range = new Set<HTMLTableCellElement>();
	private cellIndices = new Map<HTMLTableCellElement, { row: number; column: number }>();

	@HostListener('window:keydown', ['$event'])
	handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Shift') {
			this.toggleUserSelect(true);
		}
	}

	@HostListener('window:keyup', ['$event'])
	handleKeyUp(event: KeyboardEvent) {
		if (event.key === 'Shift') {
			this.toggleUserSelect(false);
		}
	}

	//press papier
	//ajouter icone keyboard avec tooltip qui explique

	private toggleUserSelect(pressed: boolean) {
		this.keyPressed = pressed;
		if (pressed) {
			this.table.style.userSelect = 'none';
			this.initListeners();
		} else {
			this.table.style.userSelect = 'auto';
			this.removeListeners();
		}
	}

	constructor(elementRef: ElementRef<HTMLTableElement>) {
		this.table = elementRef.nativeElement;

		document.addEventListener('mouseup', (event) => {
			if (!this.keyPressed) {
				this.clearCells();
			}
		});
	}

	private initListeners() {
		this.table.addEventListener('mousedown', this.handleMouseDown);
		document.addEventListener('mouseup', this.handleMouseUp);
		this.table.addEventListener('mouseover', this.handleMouseOver);
	}

	private removeListeners() {
		this.table.removeEventListener('mousedown', this.handleMouseDown);
		document.removeEventListener('mouseup', this.handleMouseUp);
		this.table.removeEventListener('mouseover', this.handleMouseOver);
	}

	private handleMouseDown = (event: MouseEvent) => {
		this.updateCellIndices();
		if (event.button !== 0) {
			return;
		}

		const cell = (event.target as HTMLElement).closest('td') as HTMLTableCellElement | null;
		if (!cell) {
			return;
		}

		this.selecting = true;
		this.startCell = cell;
		this.toggleCellSelection(cell);
	};

	private handleMouseUp = (event: MouseEvent) => {
		this.selecting = false;
	};

	private handleMouseOver = (event: MouseEvent) => {
		if (!this.selecting || !this.startCell) {
			return;
		}

		const cell = (event.target as HTMLElement).closest('td') as HTMLTableCellElement | null;
		if (cell) {
			this.selectRange(cell);
		}
	};

	private toggleCellSelection(cell: HTMLTableCellElement) {
		if (this.range.has(cell)) {
			this.range.delete(cell);
		} else {
			this.range.add(cell);
		}
		cell.classList.toggle(this.selectionClass);
		this.updateClipboard();
	}

	private selectRange(endCell: HTMLTableCellElement) {
		this.clearCells();
		this.getCellsBetween(this.startCell!, endCell).forEach(cell => {
			this.range.add(cell);
			cell.classList.add(this.selectionClass);
			this.updateClipboard();
		});
	}

	updateClipboard() {
		let text = '';
		this.range.forEach(cell => text += cell.innerText + '\t');
		if (text) {
			navigator.clipboard.writeText(text);
		}
	}

	private clearCells() {
		this.range.forEach(cell => cell.classList.remove(this.selectionClass));
		this.range.clear();
		this.updateClipboard();
	}

	private getCellsBetween(start: HTMLTableCellElement, end: HTMLTableCellElement) {
		const startCoords = this.cellIndices.get(start)!;
		const endCoords = this.cellIndices.get(end)!;
		const boundaries = {
			top: Math.min(startCoords.row, endCoords.row),
			right: Math.max(startCoords.column + start.colSpan - 1, endCoords.column + end.colSpan - 1),
			bottom: Math.max(startCoords.row + start.rowSpan - 1, endCoords.row + end.rowSpan - 1),
			left: Math.min(startCoords.column, endCoords.column),
		};

		const cells: any[] = [];

		iterateCells(this.table, (cell) => {
			const { column, row } = this.cellIndices.get(cell)!;
			if (column >= boundaries.left && column <= boundaries.right &&
				row >= boundaries.top && row <= boundaries.bottom) {
				cells.push(cell);
			}
		});

		return cells;
	}

	private updateCellIndices() {
		this.cellIndices.clear();
		const matrix: any[] = [];
		iterateCells(this.table, (cell, y, x) => {
			for (; matrix[y] && matrix[y][x]; x++) {}
			for (let spanX = x; spanX < x + cell.colSpan; spanX++) {
				for (let spanY = y; spanY < y + cell.rowSpan; spanY++) {
					(matrix[spanY] = matrix[spanY] || [])[spanX] = 1;
				}
			}
			this.cellIndices.set(cell, {row: y, column: x});
		});
	}
}

function iterateCells(table: HTMLTableElement, callback: (cell: HTMLTableCellElement, y: number, x: number) => void): void {
	for (let y = 0; y < table.rows.length; y++) {
		for (let x = 0; x < table.rows[y].cells.length; x++) {
			callback(table.rows[y].cells[x], y, x);
		}
	}
}
