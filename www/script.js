document.addEventListener('DOMContentLoaded', function() {

	var CELL_EMPTY = 0,
		CELL_CAT = 1,
		CELL_DEATH = 2,
		CELL_WALL = 3,
		MODE_CAT = 1,
		MODE_DEATH = 2,
		MODE_WALL = 3,
		divBoard = document.getElementById('board'),
		btnDeath = document.getElementById('btn_death'),
		btnCat = document.getElementById('btn_cat'),
		btnWall = document.getElementById('btn_wall'),
		btnStart = document.getElementById('btn_start'),
		btnReset = document.getElementById('btn_reset'),
		boardRows = 10,
		boardCols = 15,
		boardCells,
		posDeath,
		posCat,
		mouseMode;

	// ---------------------------------------------------------------
	function createBoard() {
		var nr, x, y, row, cell;

		boardCells = [];
		nr = 0;

		for (y = 0; y < boardRows; y++) {

			row = document.createElement('div');
			divBoard.appendChild(row);

			for (x = 0; x < boardCols; x++) {

				cell = document.createElement('div');
				cell.className = 'cell';
				cell.dataset.nr = nr;
				cell.dataset.x = x;
				cell.dataset.y = y;
				cell.addEventListener('click', clickCell);
				row.appendChild(cell);

				boardCells.push(cell);
				nr++;

			}
		}

		btnCat.addEventListener('click', clickCat);
		btnDeath.addEventListener('click', clickDeath);
		btnWall.addEventListener('click', clickWall);
		btnStart.addEventListener('click', clickStart);
		btnReset.addEventListener('click', clickReset);

	}

	// ---------------------------------------------------------------
	function resetBoard() {
		var i;

		for (i = 0; i < boardCells.length; i++) {
			boardCells[i].dataset.type = CELL_EMPTY;
			boardCells[i].innerHTML = '';
		}

		placeCat(0, true);
		placeDeath(boardCells.length - 1, true);

		btnCat.click();

	}

	// ---------------------------------------------------------------
	function changeCell(nr, type, icon, force) {

		if (!force) {
			if (boardCells[nr].dataset.type != CELL_EMPTY) {
				return false;
			}
		}

		boardCells[nr].dataset.type = type;
		boardCells[nr].innerHTML = icon;

		return true;
	}

	// ---------------------------------------------------------------
	function placeCat(nr, first) {

		if (changeCell(nr, CELL_CAT, '&#128049;')) {
			if (!first) {
				changeCell(posCat, CELL_EMPTY, '', true);
			}
			posCat = nr;
		}

	}

	// ---------------------------------------------------------------
	function placeDeath(nr, first) {

		if (changeCell(nr, CELL_DEATH, '&#9760;')) {
			if (!first) {
				changeCell(posDeath, CELL_EMPTY, '', true);
			}
			posDeath = nr;
		}

	}

	// ---------------------------------------------------------------
	function placeWall(nr) {

		if (boardCells[nr].dataset.type == CELL_EMPTY) {
			changeCell(nr, CELL_WALL, '&#128293;', true);
		} else if (boardCells[nr].dataset.type == CELL_WALL) {
			changeCell(nr, CELL_EMPTY, '', true);
		}

	}

	// ---------------------------------------------------------------
	function clickCell() {
		var nr = parseInt(this.dataset.nr);

		console.table(this.dataset); // FIXME

		switch (mouseMode) {

		case MODE_CAT:
			placeCat(nr);
			break;

		case MODE_DEATH:
			placeDeath(nr);
			break;

		case MODE_WALL:
			placeWall(nr);
			break;

		default:
			break;

		}

	}

	// ---------------------------------------------------------------
	function changeMouseMode(button, mode) {
		var buttons = [btnDeath, btnCat, btnWall],
			i;

		for (i = 0; i < buttons.length; i++) {
			if (buttons[i] == button) {
				buttons[i].className = 'selected';
			} else {
				buttons[i].className = '';
			}
		}

		mouseMode = mode;

	}

	// ---------------------------------------------------------------
	function clickCat() {
		changeMouseMode(this, MODE_CAT);
	}

	// ---------------------------------------------------------------
	function clickDeath() {
		changeMouseMode(this, MODE_DEATH);
	}

	// ---------------------------------------------------------------
	function clickWall() {
		changeMouseMode(this, MODE_WALL);
	}

	// ---------------------------------------------------------------
	function clickStart() {
		console.log('start!');
	}

	// ---------------------------------------------------------------
	function clickReset() {
		resetBoard();
	}

	// ---------------------------------------------------------------
	createBoard();
	resetBoard();

});
