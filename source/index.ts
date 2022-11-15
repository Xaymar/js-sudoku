const FIELD_SIZE = 9;

interface Array<T> {
	/**
	 * Shuffle an array in-place and returns itself.
	 */
	shuffleArray(): Array<T>;
}
Array.prototype.shuffleArray = function () {
	let idx = this.length;
	let rdx = 0;
	while (idx != 0) {
		rdx = Math.floor(Math.random() * idx);
		idx--;

		[this[idx], this[rdx]] = [this[rdx], this[idx]];
	}

	return this;
};

class Cell {
	private _value: number = 0;

	private _opt_row: Set<number>;
	private _opt_col: Set<number>;
	private _opt_grp: Set<number>;

	constructor(row: Set<number>, col: Set<number>, grp: Set<number>) {
		this._opt_row = row;
		this._opt_col = col;
		this._opt_grp = grp;
	}

	get value() {
		return this._value;
	}

	get options(): Array<number> {
		return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v, i, a) => {
			return (this._opt_col.has(v) && this._opt_row.has(v) && this._opt_grp.has(v));
		});
	}

	collapse(): number {
		const options = this.options;
		if (options.length == 0) {
			throw new OverconstrainedError("Unsolvable cell encountered");
		}

		// Get a random possible value.
		options.shuffleArray();
		this._value = options[0];

		// Eliminate this value from the possibilities.
		this._opt_row.delete(this._value);
		this._opt_col.delete(this._value);
		this._opt_grp.delete(this._value);

		return this.value;
	}
}

class Field {
	// Index as Y*FIELD_SIZE+X
	private _cells: Array<Cell> = new Array<Cell>(FIELD_SIZE * FIELD_SIZE);

	initialize() {
		const opts = Array.from({ length: 10 }, (_, i) => i + 1);

		// Initialize the WFC sets
		const rows = new Array<Set<number>>(FIELD_SIZE);
		const cols = new Array<Set<number>>(FIELD_SIZE);
		const grps = new Array<Set<number>>(FIELD_SIZE);
		for (let idx = 0; idx < FIELD_SIZE; idx++) {
			rows[idx] = new Set<number>(opts);
			grps[idx] = new Set<number>(opts);
			cols[idx] = new Set<number>(opts);
		}

		// Initialize the field cleanly.
		for (let x = 0; x < FIELD_SIZE; x++) {
			const row = rows[x];
			for (let y = 0; y < FIELD_SIZE; y++) {
				const col = cols[y];
				const grp = grps[Math.floor(y / 3) * 3 + Math.floor(x / 3)];

				this._cells[y * FIELD_SIZE + x] = new Cell(row, col, grp);
			}
		}
	}

	generate(): boolean {
		for (let attempts = 100; attempts > 0; attempts--) {
			try {
				this.initialize();

				const remainingFields = new Array(...this._cells);
				while (remainingFields.length > 0) {
					// Shuffle for increased fairness.
					remainingFields.shuffleArray();

					// Find a compatible cell.
					let lowest_num = 10;
					let lowest_idx = 0;
					let lowest_cell: Cell | null = null;
					for (let idx = 0; idx < remainingFields.length; idx++) {
						const opts = remainingFields[idx].options;
						if (opts.length < lowest_num) {
							lowest_num = opts.length;
							lowest_idx = idx;
							lowest_cell = remainingFields[idx];
						}
					}

					// If there's no cell to solve, we fucked up.
					if (lowest_cell == null) {
						throw new OverconstrainedError("Unsolvable field encountered");
					}

					// Otherwise continue as expected.
					lowest_cell.collapse();
					remainingFields.splice(lowest_idx, 1);
				}

				return true;
			} catch (ex) {
				console.warn("Randomly generated field ended up unsolvable, retrying...");
				debugger;
				continue;
			}
		}
		return false;
	}

	at(x: number, y: number) {
		return this._cells[y * FIELD_SIZE + x];
	}

	log() {
		for (let y = 0; y < FIELD_SIZE; y++) {
			const row: Array<number> = [];
			for (let x = 0; x < FIELD_SIZE; x++) {
				row.push(this.at(x, y).value);
			}
			console.log(row.join(", "));
		}
	}
}

const f = new Field();
f.generate();
f.log();
