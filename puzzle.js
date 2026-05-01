// =========================
// PUZZLE SETUP
// =========================
function createSolvedBoard(size) {
  const total = size * size;
  const arr = [];

  for (let i = 0; i < total - 1; i++) {
    arr.push(i);
  }

  arr.push(null);
  return arr;
}

function setupBoard() {
  if (!currentImage) {
    messageText.textContent = "Please choose an image first.";
    return;
  }

  boardSize = parseInt(sizeSelect.value, 10);
  solvedTiles = createSolvedBoard(boardSize);
  tiles = [...solvedTiles];
  moves = 0;
  gameStarted = true;
  hasWon = false;
  celebrationArmed = false;

  moveCountText.textContent = moves;
  renderBoard();
}

function renderBoard() {
  puzzleBoard.innerHTML = "";
  puzzleBoard.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  puzzleBoard.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  tiles.forEach((value, index) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");

    if (value === null) {
      tile.classList.add("empty");
    } else {
      const row = Math.floor(value / boardSize);
      const col = value % boardSize;

      tile.style.backgroundImage = `url('${currentImage}')`;
      tile.style.backgroundSize = `${boardSize * 100}% ${boardSize * 100}%`;
      tile.style.backgroundPosition = `${(col / (boardSize - 1)) * 100}% ${(row / (boardSize - 1)) * 100}%`;

      tile.addEventListener("click", () => moveTile(index));
    }

    puzzleBoard.appendChild(tile);
  });

  if (checkWin() && !hasWon && gameStarted && celebrationArmed) {
    hasWon = true;
    messageText.textContent = `🎉 Great job! You did it in ${moves} moves!`;
    launchFireworks();
  }
}

function moveTile(index) {
  if (!gameStarted || hasWon) return;

  const emptyIndex = tiles.indexOf(null);

  const tileRow = Math.floor(index / boardSize);
  const tileCol = index % boardSize;
  const emptyRow = Math.floor(emptyIndex / boardSize);
  const emptyCol = emptyIndex % boardSize;

  const isAdjacent =
    (tileRow === emptyRow && Math.abs(tileCol - emptyCol) === 1) ||
    (tileCol === emptyCol && Math.abs(tileRow - emptyRow) === 1);

  if (!isAdjacent) return;

  [tiles[index], tiles[emptyIndex]] = [tiles[emptyIndex], tiles[index]];
  moves++;
  celebrationArmed = true;
  moveCountText.textContent = moves;
  renderBoard();
}

function getNeighborIndexes(emptyIndex) {
  const neighbors = [];
  const row = Math.floor(emptyIndex / boardSize);
  const col = emptyIndex % boardSize;

  if (row > 0) neighbors.push(emptyIndex - boardSize);
  if (row < boardSize - 1) neighbors.push(emptyIndex + boardSize);
  if (col > 0) neighbors.push(emptyIndex - 1);
  if (col < boardSize - 1) neighbors.push(emptyIndex + 1);

  return neighbors;
}

function shuffleBoard(times = 300) {
  if (!currentImage) {
    messageText.textContent = "Please choose an image first.";
    return;
  }

  for (let i = 0; i < times; i++) {
    const emptyIndex = tiles.indexOf(null);
    const neighbors = getNeighborIndexes(emptyIndex);
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
  }

  moves = 0;
  hasWon = false;
  celebrationArmed = false;
  moveCountText.textContent = moves;
  messageText.textContent = "Puzzle shuffled. Solve it!";
  renderBoard();
}

function solveBoard() {
  tiles = [...solvedTiles];
  hasWon = false;
  celebrationArmed = false;
  renderBoard();
  messageText.textContent = "Puzzle solved.";
}

function checkWin() {
  for (let i = 0; i < solvedTiles.length; i++) {
    if (tiles[i] !== solvedTiles[i]) {
      return false;
    }
  }
  return true;
}
