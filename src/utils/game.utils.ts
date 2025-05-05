export const checkForOutflank = (cells: string[], currentPlayer: string) => {
  const opponent = currentPlayer === "W" ? "B" : "W";
  let hasOpponentTokenInPath = false;
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      return false;
    }
    if (cells[i] === opponent) {
      hasOpponentTokenInPath = true;
    }
    if (cells[i] === currentPlayer) {
      return hasOpponentTokenInPath;
    }
  }
  return false;
};

/**
 * Returns a set of cells that are outflanked by the current player
 * ex WWWWWB returns [WWWWW]
 * @param cells
 * @param currentPlayer
 * @returns
 */
export const getOutflankCells = (cells: string[], currentPlayer: string) => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i] === "") {
      break;
    }

    if (cells[i] === currentPlayer) {
      return cells.slice(0, i);
    }
  }
  return [];
};

export const getValidMoves = (board: string[][], currentPlayer: string) => {
  const validMoves: {
    rowIndex: number;
    colIndex: number;
  }[] = [];
  for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
    for (let colIndex = 0; colIndex < board[rowIndex].length; colIndex++) {
      if (board[rowIndex][colIndex] === "") {
        // Check if this is a valid move
        const row = board[rowIndex];

        // right
        let cells = row.slice(colIndex + 1);
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // left
        cells = row.slice(0, colIndex).reverse();
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // up
        cells = board
          .slice(0, rowIndex)
          .map((row) => row[colIndex])
          .reverse();
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // down
        cells = board.slice(rowIndex + 1).map((row) => row[colIndex]);
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // up left
        cells = board
          .slice(0, rowIndex)
          .map((row) => row[colIndex])
          .reverse();
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // up right
        cells = board
          .slice(0, rowIndex)
          .map((row) => row[colIndex])
          .reverse();
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // down left
        cells = board.slice(rowIndex + 1).map((row) => row[colIndex]);
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }

        // down right
        cells = board.slice(rowIndex + 1).map((row) => row[colIndex]);
        if (checkForOutflank(cells, currentPlayer)) {
          validMoves.push({ rowIndex, colIndex });
          continue;
        }
      }
    }
  }
  return validMoves;
};
