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
		boardCols = 15,
		boardRows = 10,
		boardCells,
		boardDirty,
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

		boardDirty = true;
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
		var nr = parseInt(this.dataset.nr),
			i;

		// czyszczenie planszy
		if (boardDirty) {

			for (i = 0; i < boardCells.length; i++) {
				if (boardCells[i].dataset.type == CELL_EMPTY) {
					boardCells[i].innerHTML = '';
				}
			}

			boardDirty = false;

		}

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
		findPath(posCat, posDeath);
	}

	// ---------------------------------------------------------------
	function clickReset() {
		resetBoard();
	}

	// ---------------------------------------------------------------
	function findNeighbours(pos) {
		var x = boardCells[pos].dataset.x,
			y = boardCells[pos].dataset.y,
			neighbours = [];

		// kierunek w lewo
		if (x > 0) {
			neighbours.push(pos - 1);
		}

		// kierunek w prawo
		if (x < boardCols - 1) {
			neighbours.push(pos + 1);
		}

		// kierunek w górę
		if (y > 0) {
			neighbours.push(pos - boardCols);
		}

		// kierunek w dół
		if (y < boardRows - 1) {
			neighbours.push(pos + boardCols);
		}

		return neighbours;
	}

	// ---------------------------------------------------------------
	function findPath(start, goal) {
		var queue = [],
			visited = [],
			backtrace = [],
			current, neighbours, check, path, i;

		// inicjalizacja tablicy odwiedzonych komórek (przeszkody jako odwiedzone)
		for (i = 0; i < boardCells.length; i++) {
			if (boardCells[i].dataset.type == CELL_WALL) {
				visited.push(true);
			} else {
				visited.push(false);
			}
		}

		// inicjalizacja tablicy historii ścieżki
		for (i = 0; i < boardCells.length; i++) {
			backtrace.push(-1);
		}

		// pozycja startowa do kolejki
		queue = [start];

		// pętla po kolejce pól do sprawdzenia
		while (queue.length > 0) {

			// pobranie pierwszego pola z listy
			current = queue.shift();

			// czy dotarliśmy do celu?
			if (current == goal) {
				break;
			}

			// punkt na planszy
			if (current != start) {
				boardCells[current].innerHTML = '&#128062;';
			}

			// pobranie listy wszystkich sąsiadów
			neighbours = findNeighbours(current);

			// pętla po sąsiadujących polach
			for (i = 0; i < neighbours.length; i++) {
				check = neighbours[i];

				// czy pole nie było jeszcze odwiedzone?
				if (visited[check] == false) {

					// zaznaczenie flagi odwiedzenia pola
					visited[check] = true;

					// zapamiętanie z którego pola tu trafiliśmy
					backtrace[check] = current;

					// dodanie pola do listy do sprawdzenia
					queue.push(check);

				}

			}

		}

		// czy znaleźliśmy drogę do celu?
		if (current == goal) {

			// odtwarzamy ścieżkę od końca do początku
			path = [ goal ];
			current = goal;
			while (current != start) {
				current = backtrace[current];
				path.unshift(current);
			}

			// gotowa ścieżka
			if (path.length > 2) {

				for (i = 1; i < path.length - 1; i++) {
					boardCells[path[i]].innerHTML = i;
				}

				boardDirty = true;

			}

		}

	}

	// ---------------------------------------------------------------
	createBoard();
	resetBoard();

});
