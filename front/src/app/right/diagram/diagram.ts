import { Entity, ForeignKeyReference, ParseResult } from './types';

const {abs, sign, min, max} = Math;

type Rect = {
	left: number
	right: number
	top: number
	bottom: number
	width: number
	height: number
}

export class DiagramController {

	tablesContainer: TablesContainer;
	tableMap = new Map<string, TableController>()
	maxZIndex = 0
	fontSize = 1
	barRadius!: number;
	public isAutoMoving = false

	onMouseMove?: (ev: { clientX: number; clientY: number }) => void

	constructor(public div: HTMLDivElement, scrollableDiagram: HTMLDivElement) {
		this.tablesContainer = new TablesContainer(this, scrollableDiagram);

		this.div.addEventListener('mousemove', ev => {
			if (this.onMouseMove) {
				this.onMouseMove(ev)
			} else {
				this.tablesContainer.onMouseMove(ev)
			}
		})
		this.div.addEventListener('touchmove', ev => {
			const e = ev.touches.item(0)
			if (!e) return
			if (this.onMouseMove) {
				this.onMouseMove(e)
			} else {
				this.tablesContainer.onMouseMove(e)
			}
		})
		this.div.addEventListener('mouseup', () => {
			delete this.onMouseMove
		})
		this.div.addEventListener('touchend', () => {
			delete this.onMouseMove
		})

		this.applyFontSize()
	}

	getDiagramRect(): Rect {
		const rect = this.div.getBoundingClientRect()
		return {
			top: rect.top,
			bottom: rect.bottom,
			left: rect.left,
			right: rect.right,
			width: this.div.scrollWidth,
			height: this.div.scrollHeight,
		}
	}

	calcBarRadius() {
		return +getComputedStyle(this.div).fontSize.replace('px', '') * 2.125
	}

	add(table: Entity, diagramRect: Rect) {
		const tableDiv = document.createElement('div')
		tableDiv.dataset['table'] = table.name
		let isMouseDown = false
		let startX = 0
		let startY = 0
		const onMouseDown = (ev: { clientX: number; clientY: number }) => {
			this.maxZIndex++
			tableDiv.style.zIndex = this.maxZIndex.toString()
			isMouseDown = true
			startX = ev.clientX
			startY = ev.clientY
			this.onMouseMove = ev => {
				if (!isMouseDown) return
				controller.translateX += ev.clientX - startX
				controller.translateY += ev.clientY - startY
				startX = ev.clientX
				startY = ev.clientY
				controller.renderTransform(this.getDiagramRect())
			}
		}
		tableDiv.addEventListener('mousedown', ev => {
			onMouseDown(ev)
		})
		tableDiv.addEventListener('touchstart', ev => {
			const e = ev.touches.item(0)
			if (!e) return
			onMouseDown(e)
		})
		tableDiv.addEventListener('mouseup', () => {
			isMouseDown = false
		})
		tableDiv.addEventListener('touchend', () => {
			isMouseDown = false
		})
		this.tablesContainer.appendChild(tableDiv)

		const controller = new TableController(this, tableDiv, table)
		this.tableMap.set(table.name, controller)
		controller.render(table)
		controller.renderTransform(diagramRect)
	}

	render({table_list, view, zoom}: ParseResult) {
		if (view) {
			this.tablesContainer.translateX = view.x
			this.tablesContainer.translateY = view.y
			this.tablesContainer.renderTransform()
		}

		if (zoom) {
			this.fontSize = zoom
			this.applyFontSize()
		}

		const newTableMap = new Map(table_list.map(table => [table.name, table]))

		const diagramRect = this.getDiagramRect()


		newTableMap.forEach((table, name) => {
			const controller = this.tableMap.get(name)
			if (controller) {
				controller.render(table)
			} else {
				this.add(table, diagramRect)
			}
		})


		this.tableMap.forEach(table => {
			table.renderLine(diagramRect)
		})
	}

	autoPlace() {
		this.isAutoMoving = !this.isAutoMoving

		if (!this.isAutoMoving) return

		const tables: Array<{
			table: TableController
			rect: {
				top: number
				bottom: number
				left: number
				right: number
				force: { x: number; y: number }
				speed: { x: number; y: number }
			}
		}> = []
		this.tableMap.forEach(table => {
			const rect = table.div.getBoundingClientRect()
			tables.push({
				table,
				rect: {
					top: rect.top,
					bottom: rect.bottom,
					left: rect.left,
					right: rect.right,
					force: {x: 0, y: 0},
					speed: {x: 0, y: 0},
				},
			})
		})
		const diagramRect = this.getDiagramRect()

		const loop = () => {
			if (!this.isAutoMoving) return

			let isMoved = false

			tables.forEach(({table, rect}) => {

				rect.force.y =
					rect.top < diagramRect.top
						? +1
						: rect.bottom > diagramRect.bottom
							? -1
							: 0
				rect.force.x =
					rect.left < diagramRect.left
						? +1
						: rect.right > diagramRect.right
							? -1
							: 0


				tables.forEach(other => {
					if (other.table === table) return
					if (isPointInside(other.rect, rect.left, rect.top)) {
						rect.force.x += 1
						rect.force.y += 1
					}
					if (isPointInside(other.rect, rect.right, rect.top)) {
						rect.force.x -= 1
						rect.force.y += 1
					}
					if (isPointInside(other.rect, rect.left, rect.bottom)) {
						rect.force.x += 1
						rect.force.y -= 1
					}
					if (isPointInside(other.rect, rect.right, rect.bottom)) {
						rect.force.x -= 1
						rect.force.y -= 1
					}
				})


				rect.speed.x += rect.force.x
				rect.speed.y += rect.force.y


				const minSpeed = 1
				if (
					Math.abs(rect.speed.x) < minSpeed &&
					Math.abs(rect.speed.y) < minSpeed
				) {
					return
				}


				table.translateX += rect.speed.x
				table.translateY += rect.speed.y

				isMoved = true


				rect.left += rect.speed.x
				rect.right += rect.speed.x
				rect.top += rect.speed.y
				rect.bottom += rect.speed.y


				rect.speed.x *= 0.95
				rect.speed.y *= 0.95
			})

			if (!isMoved) {
				this.isAutoMoving = false
				return
			}

			loop()
		}
		loop()

		this.tableMap.forEach(table => {
			table.quickRenderTransform(diagramRect);
		})
	}

	applyFontSize() {
		this.div.style.fontSize = this.fontSize + 'em'
		this.barRadius = this.calcBarRadius()
		const diagramRect = this.getDiagramRect()
		this.tableMap.forEach(table => {
			table.renderLine(diagramRect)
		})
	}
}

export class TablesContainer {
	translateX = 0
	translateY = 0
	onMouseMove: (ev: { clientX: number; clientY: number }) => void

	constructor(public diagram: DiagramController, public div: HTMLDivElement) {
		this.div.style.transform = `translate(${this.translateX}px,${this.translateY}px)`

		let isMouseDown = false
		let startX = 0
		let startY = 0
		this.onMouseMove = ev => {
			if (!isMouseDown) return

			this.translateX += ev.clientX - startX
			this.translateY += ev.clientY - startY

			startX = ev.clientX
			startY = ev.clientY

			this.renderTransform()
		}
		const onMouseDown = (ev: { clientX: number; clientY: number }) => {
			isMouseDown = true
			startX = ev.clientX
			startY = ev.clientY
		}
		const container = this.diagram.div
		container.addEventListener('mousedown', ev => {
			onMouseDown(ev)
		})
		container.addEventListener('touchstart', ev => {
			const e = ev.touches.item(0)
			if (!e) return
			onMouseDown(e)
		})
		container.addEventListener('mouseup', () => {
			isMouseDown = false
		})
		container.addEventListener('touchend', () => {
			isMouseDown = false
		})
	}

	appendChild(node: Node) {
		this.div.appendChild(node)
	}

	renderTransform() {
		const x = this.translateX.toString()
		const y = this.translateY.toString()

		this.div.style.transform = `translate(${x}px,${y}px)`
		const diagramRect = this.diagram.getDiagramRect()
		this.diagram.tableMap.forEach(tableController =>
			tableController.renderLinesTransform(diagramRect),
		)
	}
}

type RectCorner = {
	left: number
	right: number
	top: number
	bottom: number
}

function isPointInside(rect: RectCorner, x: number, y: number): boolean {
	return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom
}

class TableController {
	translateX = 0
	translateY = 0

	_lineMap = new Map<string, LineController>()

	onMoveListenerSet = new Set<(diagramRect: Rect) => void>()

	tbody: HTMLTableSectionElement
	fieldMap = new Map<string, HTMLTableRowElement>()

	constructor(
		public diagram: DiagramController,
		public div: HTMLDivElement,
		public data: Entity,
	) {
		let txt = `<table><thead><tr><th colspan="100%">`;
		txt += data.view ? `<i>${data.name}</i>` : data.name;
		txt += `</th></tr></thead><tbody></tbody></table>`;

		this.div.innerHTML = txt;
		this.tbody = this.div.querySelector('tbody') as HTMLTableSectionElement
	}

	toFieldKey(own_field: string, table: string, other_field: string) {
		return `${own_field}:${table}.${other_field}`
	}

	getLine(own_field: string, table: string, other_field: string) {
		const key = this.toFieldKey(own_field, table, other_field)
		return this._lineMap.get(key)
	}

	setLine(
		own_field: string,
		table: string,
		other_field: string,
		line: LineController,
	) {
		const key = this.toFieldKey(own_field, table, other_field)
		this._lineMap.set(key, line)
	}

	getFieldElement(field: string) {
		return this.fieldMap.get(field)
	}

	render(data: Entity) {
		this.data = data

		const newFieldSet = new Set<string>()
		data.field_list.forEach(field => newFieldSet.add(field.name))


		this.fieldMap.forEach((field, name) => {
			if (!newFieldSet.has(name)) {
				field.remove()
				this.fieldMap.delete(name)
			}
		})


		data.field_list.forEach(
			({name, type, tags, references}) => {

				let tr = this.fieldMap.get(name)
				if (!tr) {
					tr = document.createElement('tr')
					tr.dataset['tableField'] = name
					this.fieldMap.set(name, tr)
				}

				if (references && !tr.classList.contains(references.name)) {
					tr.classList.add(references.name)
				}

				if (tags.length < 1) {
					tr.classList.add('details')
				}

				if (type.length > 30) {
					type = type.substring(0, 30) + '...';
				}

				tr.innerHTML = `
<td class='table-field-tag'>${tags.join('　')}</td>
<td class='table-field-name'>${name}</td>
<td class='table-field-type'>${type}</td>
`
				this.tbody.appendChild(tr)
			},
		)


		if (
			data.position &&
			(data.position.x != this.translateX || data.position.y != this.translateY)
		) {
			this.translateX = data.position.x
			this.translateY = data.position.y
			this.renderTransform(this.diagram.getDiagramRect())
		}
	}

	renderTransform(diagramRect: Rect) {
		const x = this.translateX.toString()
		const y = this.translateY.toString()
		this.div.style.transform = `translate(${x}px,${y}px)`
		this.onMoveListenerSet.forEach(fn => fn(diagramRect))
	}

	quickRenderTransform(diagramRect: Rect) {
		const x = this.translateX.toString()
		const y = this.translateY.toString()
		this.div.style.transform = `translate(${x}px,${y}px)`
		this.onMoveListenerSet.forEach(fn => fn(diagramRect))
	}

	renderLinesTransform(diagramRect: Rect) {
		this._lineMap.forEach(lineController => lineController.render(diagramRect))
	}

	renderLine(diagramRect: Rect) {
		const newFieldRefMap = new Map<string, ForeignKeyReference>()

		this.data.field_list.forEach(field => {
			if (field.references) {
				newFieldRefMap.set(field.name, field.references)
			}
		})


		newFieldRefMap.forEach((reference, field) => {
			const lineController = this.getLine(
				field,
				reference.table,
				reference.field,
			)
			if (lineController) {
				lineController.relation = reference
				lineController.render(diagramRect)
			} else {
				this.addLine(field, reference, diagramRect)
			}
		})
	}

	addLine(field: string, reference: ForeignKeyReference, diagramRect: Rect) {
		const fromDiv = this.getFieldElement(field)
		if (!fromDiv) return

		const toTable = this.diagram.tableMap.get(reference.table)
		if (!toTable) return
		const toDiv = toTable.getFieldElement(reference.field)
		if (!toDiv) return

		const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

		this.diagram.div.appendChild(svg)

		const from: LineReference = {field, table: this}
		const to: LineReference = {field: reference.field, table: toTable}

		const controller = new LineController(
			this.diagram,
			svg,
			from,
			to,
			reference,
		)
		this.setLine(field, reference.table, reference.field, controller)
		controller.render(diagramRect)
	}
}

type LineReference = {
	table: TableController
	field: string
}

class LineController {
	line: any;
	head: any;
	tail: any;

	constructor(
		public diagram: DiagramController,
		public svg: SVGElement,
		public from: LineReference,
		public to: LineReference,
		public relation: ForeignKeyReference,
	) {
		this.line = this.makePath()
		this.head = this.makePath()
		this.tail = this.makePath()

		this.render = this.render.bind(this)
		from.table.onMoveListenerSet.add(this.render)
		to.table.onMoveListenerSet.add(this.render)
	}

	makePath() {
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
		path.classList.add(this.relation.name);

		path.setAttributeNS(null, 'stroke', '#1DE9B698')
		path.setAttributeNS(null, 'stroke-width', '1.5')
		path.setAttributeNS(null, 'fill', 'none')
		this.svg.appendChild(path)
		return path
	}

	render(diagramRect: Rect) {
		requestAnimationFrame(() => {
			const div = this.diagram.div
			const offsetX = div.scrollLeft
			const offsetY = div.scrollTop
			this.svg.style.left = offsetX + 'px'
			this.svg.style.top = offsetY + 'px'
		})
		const fromDiv = this.from.table.getFieldElement(this.from.field)
		if (!fromDiv) return
		const toDiv = this.to.table.getFieldElement(this.to.field)
		if (!toDiv) return

		const fromRect = fromDiv.getBoundingClientRect()
		const toRect = toDiv.getBoundingClientRect()

		const barRadius = this.diagram.barRadius
		const gap = barRadius / 2
		const margin = gap * 2

		const from_y = fromRect.top + fromRect.height / 2 - diagramRect.top
		const to_y = toRect.top + toRect.height / 2 - diagramRect.top

		let from_x: number
		let to_x: number

		let from_bar_x: number
		let from_margin_x: number
		let to_margin_x: number
		let to_bar_x: number

		let from_bar_border_x: number
		let to_bar_border_x: number

		if (fromRect.right + gap < toRect.left - gap) {
			/**
			 * [from]---[to]
			 */
			from_x = fromRect.right - diagramRect.left
			to_x = toRect.left - diagramRect.left

			from_bar_x = from_x + gap
			from_margin_x = from_x + margin
			to_margin_x = to_x - margin
			to_bar_x = to_x - gap

			from_bar_border_x = from_x + gap
			to_bar_border_x = to_x - gap
		} else if (toRect.right + gap < fromRect.left - gap) {
			/**
			 * [to]---[from]
			 */
			from_x = fromRect.left - diagramRect.left
			to_x = toRect.right - diagramRect.left

			from_bar_x = from_x - gap
			from_margin_x = from_x - margin
			to_margin_x = to_x + margin
			to_bar_x = to_x + gap

			from_bar_border_x = from_x - gap
			to_bar_border_x = to_x + gap
		} else {
			const right_dist = abs(fromRect.right - toRect.right)
			const left_dist = abs(fromRect.left - toRect.left)
			if (right_dist < left_dist) {
				/**
				 * [from]-
				 *        \
				 *        |
				 *        /
				 *   [to]-
				 */
				from_x = fromRect.right - diagramRect.left
				to_x = toRect.right - diagramRect.left

				const edge_x = max(from_x, to_x)

				from_bar_x = edge_x + gap
				from_margin_x = edge_x + margin
				to_margin_x = edge_x + margin
				to_bar_x = edge_x + gap

				from_bar_border_x = from_x + gap
				to_bar_border_x = to_x + gap
			} else {
				/**
				 *  -[from]
				 * /
				 * |
				 * \
				 *  -[to]
				 */
				from_x = fromRect.left - diagramRect.left
				to_x = toRect.left - diagramRect.left

				const edge_x = min(from_x, to_x)

				from_bar_x = edge_x - gap
				from_margin_x = edge_x - margin
				to_margin_x = edge_x - margin
				to_bar_x = edge_x - gap

				from_bar_border_x = from_x - gap
				to_bar_border_x = to_x - gap
			}
		}

		let path = ''

		// from field
		path += ` M ${from_x} ${from_y}`
		path += ` L ${from_bar_x} ${from_y}`

		// relation link
		path += `C ${from_margin_x} ${from_y}`
		path += `  ${to_margin_x} ${to_y}`
		path += `  ${to_bar_x} ${to_y}`

		// to field
		path += ` L ${to_x} ${to_y}`

		this.line.setAttributeNS(null, 'd', path.trim())

		const relation = this.relation
		const first = relation.type[0]
		const last = relation.type[this.relation.type.length - 1]

		renderRelationBar({
			path: this.head,
			from_x,
			from_y,
			border_x: from_bar_border_x,
			barRadius,
			type: relation.type.startsWith('>0')
				? 'zero-or-many'
				: first === '>'
					? 'many'
					: first === '0'
						? 'zero'
						: first === '-'
							? 'one'
							: 'default',
		})

		renderRelationBar({
			path: this.tail,
			from_x: to_x,
			from_y: to_y,
			border_x: to_bar_border_x,
			barRadius,
			type: relation.type.endsWith('0<')
				? 'zero-or-many'
				: last === '<'
					? 'many'
					: last === '0'
						? 'zero'
						: last === '-'
							? 'one'
							: 'default',
		})
	}
}

type RelationBarType = 'many' | 'one' | 'zero' | 'zero-or-many' | 'default'

function renderRelationBar({
							   path,
							   from_x: f_x,
							   from_y: f_y,
							   border_x: b_x,
							   barRadius,
							   type,
						   }: {
	path: SVGPathElement
	from_x: number
	from_y: number
	border_x: number
	barRadius: number
	type: RelationBarType
}) {
	// arrow
	const a_x = b_x - (b_x - f_x) / 3
	const a_t = f_y - barRadius / 4
	const a_b = f_y + barRadius / 4

	switch (type) {
		case 'many':
			path.setAttributeNS(
				null,
				'd',
				`M ${a_x} ${f_y} L ${f_x} ${a_t} M ${a_x} ${f_y} L ${f_x} ${a_b}`,
			)
			break
		case 'one':
			path.setAttributeNS(null, 'd', `M ${a_x} ${a_t} V ${a_b}`)
			break
		case 'zero': {
			const r = (a_t - a_b) / 3
			const x = b_x
			path.setAttributeNS(
				null,
				'd',
				`M ${x} ${f_y} A ${r} ${r} 0 1 0 ${x} ${f_y - 0.001 * sign(f_x - a_x)}`,
			)
			break
		}
		case 'zero-or-many': {
			const r = (a_t - a_b) / 5
			const x = b_x
			path.setAttributeNS(
				null,
				'd',
				`M ${x} ${f_y} A ${r} ${r} 0 1 0 ${x} ${f_y - 0.001 * sign(f_x - a_x)}
         M ${a_x} ${f_y} L ${f_x} ${a_t}
         M ${a_x} ${f_y} L ${f_x} ${a_b}
         M ${a_x} ${f_y} L ${f_x} ${f_y}
        `,
			)
			break
		}
		default:
			path.setAttributeNS(null, 'd', ``)
	}
}
