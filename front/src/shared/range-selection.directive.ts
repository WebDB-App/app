import { Directive, ElementRef, HostListener, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, pipe, Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';

@Directive({
	selector: 'table[range-selection]',
})
export class RangeSelectionDirective implements OnDestroy, OnInit {
	@Input() selectionClass = 'selected-cell';

	selectedRange = new Set<HTMLTableCellElement>();

	private readonly table: HTMLTableElement;
	private startCell?: HTMLTableCellElement;
	private cellIndices = new Map<HTMLTableCellElement, { row: number; column: number }>();
	private selecting: boolean = false;
	private destroy$ = new Subject<void>();

	@HostListener('keydown', ['$event'])
	onKeyUp(e: KeyboardEvent) {
		switch (e.code) {
			case "ArrowUp":
				//current cell ou 0, 0
				//this.keyboardService.sendMessage({ element: this.element, action: 'UP' })
				break;
			case "ArrowRight":
				break;
			case "ArrowDown":
				break;
			case "ArrowLeft":
				break;
		}
	}

	constructor(private zone: NgZone, {nativeElement}: ElementRef<HTMLTableElement>) {
		this.table = nativeElement;
	}

	//ajouter cmd pour cell individuel
	//press papier

	ngOnInit() {
		//this.zone.runOutsideAngular(() => this.initListeners());
	}

	private initListeners() {
		const withCell = pipe(
			map((event: MouseEvent) => ({event, cell: (event.target as HTMLElement).closest<HTMLTableCellElement>('td')})),
			filter(({cell}) => !!cell),
		);
		const mouseDown$ = fromEvent<MouseEvent>(this.table, 'mousedown')
			.pipe(
				filter(event => event.button === 0),
				// @ts-ignore
				withCell,
				tap(this.startSelection)
			);
		const mouseOver$ = fromEvent<MouseEvent>(this.table, 'mouseover');
		const mouseUp$ = fromEvent(document, 'mouseup').pipe(
			tap(() => this.selecting = false)
		);
		this.handleOutsideClick();

		mouseDown$.pipe(
			switchMap(() => mouseOver$.pipe(takeUntil(mouseUp$))),
			takeUntil(this.destroy$),
			withCell
			// @ts-ignore
		).subscribe(this.select);
	}

	private handleOutsideClick() {
		fromEvent(document, 'mouseup').pipe(
			takeUntil(this.destroy$)
		).subscribe((event: any) => {
			if (!this.selecting && !this.table.contains(event.target as HTMLElement)) {
				this.clearCells();
			}
		});
	}

	private startSelection = ({cell, event}: { event: MouseEvent, cell: HTMLTableCellElement }) => {
		this.updateCellIndices();
		if (!event.ctrlKey && !event.shiftKey) {
			this.clearCells();
		}

		if (event.shiftKey) {
			this.select({cell});
		}

		this.selecting = true;
		this.startCell = cell;

		if (!event.shiftKey) {
			if (this.selectedRange.has(cell)) {
				this.selectedRange.delete(cell);
			} else {
				this.selectedRange.add(cell);
			}
			cell.classList.toggle(this.selectionClass);
		}
	};

	private select = ({cell}: { cell: HTMLTableCellElement }) => {
		this.clearCells();
		this.getCellsBetween(this.startCell!, cell).forEach(item => {
			this.selectedRange.add(item);
			item.classList.add(this.selectionClass);
		});
	};

	private clearCells() {
		Array.from(this.selectedRange).forEach(cell => {
			cell.classList.remove(this.selectionClass);
		});
		this.selectedRange.clear();
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

	ngOnDestroy() {
		this.destroy$.next();
	}
}

function iterateCells(table: HTMLTableElement, callback: (cell: HTMLTableCellElement, y: number, x: number) => void): void {
	for (let y = 0; y < table.rows.length; y++) {
		for (let x = 0; x < table.rows[y].cells.length; x++) {
			callback(table.rows[y].cells[x], y, x);
		}
	}
}
