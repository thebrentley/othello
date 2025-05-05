import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { BoardCell } from "../molecules/BoardCell";
import { Hand, CircleNotch, Brain } from "@phosphor-icons/react";
import {
  finishGame,
  makeMove,
  makeComputerMove,
  skipTurn,
  resetLastPlayerTurnSkipped,
} from "@/store/gameSlice";
import { getOutflankCells, getValidMoves } from "@/utils/game.utils";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import { ValidMove } from "@/types/game.types";

const GameBoard: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const board = useAppSelector((state) => state.game.board);
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer);
  const lastPlayerTurnSkipped = useAppSelector(
    (state) => state.game.lastPlayerTurnSkipped
  );
  const currentPlayerType = useAppSelector((state) =>
    currentPlayer === "W"
      ? state.game.playerWhiteType
      : state.game.playerBlackType
  );
  const playerWhiteType = useAppSelector((state) => state.game.playerWhiteType);
  const playerBlackType = useAppSelector((state) => state.game.playerBlackType);
  const playerBLastMoveDetails = useAppSelector(
    (state) => state.game.playerBLastMoveDetails
  );
  const playerWLastMoveDetails = useAppSelector(
    (state) => state.game.playerWLastMoveDetails
  );
  const [selectedCell, setSelectedCell] = useState<ValidMove | null>(null);
  const [showThinkingDialog, setShowThinkingDialog] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  const validMoves = useMemo(() => {
    return getValidMoves(board, currentPlayer);
  }, [board, currentPlayer]);

  useEffect(() => {
    dispatch(resetLastPlayerTurnSkipped());
  }, [dispatch]);

  useEffect(() => {
    // if there are no valid moves for the current player, proceed to the next player
    if (!validMoves.length) {
      // additionally check if the last player turn was skipped
      if (lastPlayerTurnSkipped) {
        // calculate the winner (most pieces on the board)
        const whitePieces = board.flat().filter((cell) => cell === "W").length;
        const blackPieces = board.flat().filter((cell) => cell === "B").length;
        setWinner(whitePieces > blackPieces ? "W" : "B");
      } else {
        dispatch(skipTurn());
      }
    }
  }, [validMoves, currentPlayer, dispatch, board, lastPlayerTurnSkipped]);

  useEffect(() => {
    // If it's the computer's turn, make a move
    if (currentPlayerType === "computer" && !winner) {
      dispatch(makeComputerMove());
    }
  }, [currentPlayer, currentPlayerType, dispatch, winner]);

  const isCellValid = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (board[rowIndex][colIndex] !== "") {
        return false;
      }

      return validMoves.find(
        (move) => move.rowIndex === rowIndex && move.colIndex === colIndex
      );
    },
    [board, validMoves]
  );

  const boardWithValidMoves = useMemo(() => {
    return board.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const valid = isCellValid(rowIndex, colIndex);
        if (!valid) {
          return { token: cell };
        }
        return {
          token: currentPlayer,
          isCellValid: true,
        };
      })
    );
  }, [board, currentPlayer, isCellValid]);

  const boardWithPendingMove = useMemo(() => {
    if (!selectedCell) {
      return boardWithValidMoves;
    }

    // add selected cell to the board
    const boardWithPendingMove = boardWithValidMoves.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        // if the currently hovered cell is valid
        // show the preview
        if (
          rowIndex === selectedCell?.rowIndex &&
          colIndex === selectedCell?.colIndex &&
          isCellValid(rowIndex, colIndex)
        ) {
          return { token: currentPlayer, isPreview: true };
        }

        return { ...cell };
      })
    );

    // get all cells that are affected by the selected cell in all directions
    let affectedCells: string[] = [];
    // up
    const up = getOutflankCells(
      board
        .slice(0, selectedCell.rowIndex)
        .map((row) => row[selectedCell.colIndex])
        .reverse(),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...up.map(
        (_, index) =>
          `${selectedCell.rowIndex - 1 - index},${selectedCell.colIndex}`
      ),
    ];
    // down
    const down = getOutflankCells(
      board
        .slice(selectedCell.rowIndex + 1)
        .map((row) => row[selectedCell.colIndex]),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...down.map(
        (_, index) =>
          `${selectedCell.rowIndex + index + 1},${selectedCell.colIndex}`
      ),
    ];
    // left
    const left = getOutflankCells(
      board[selectedCell.rowIndex].slice(0, selectedCell.colIndex).reverse(),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...left.map(
        (cell, index) =>
          `${selectedCell.rowIndex},${selectedCell.colIndex - index - 1}`
      ),
    ];
    // right
    const right = getOutflankCells(
      board[selectedCell.rowIndex].slice(selectedCell.colIndex + 1),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...right.map(
        (_, index) =>
          `${selectedCell.rowIndex},${selectedCell.colIndex + index + 1}`
      ),
    ];
    // diagonally up left
    const diagonallyUpLeft = getOutflankCells(
      board
        .slice(0, selectedCell.rowIndex)
        .reverse()
        .map((row, index) => row[selectedCell.colIndex - index - 1]),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...diagonallyUpLeft.map(
        (cell, index) =>
          `${selectedCell.rowIndex - index - 1},${
            selectedCell.colIndex - index - 1
          }`
      ),
    ];
    // diagonally up right
    const diagonallyUpRight = getOutflankCells(
      board
        .slice(0, selectedCell.rowIndex)
        .reverse()
        .map((row, index) => row[selectedCell.colIndex + index + 1]),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...diagonallyUpRight.map(
        (_, index) =>
          `${selectedCell.rowIndex - index - 1},${
            selectedCell.colIndex + index + 1
          }`
      ),
    ];
    // diagonally down left
    const diagonallyDownLeft = getOutflankCells(
      board
        .slice(selectedCell.rowIndex + 1)
        .map((row, index) => row[selectedCell.colIndex - index - 1]),
      currentPlayer
    );
    // diagonally down right
    const diagonallyDownRight = getOutflankCells(
      board
        .slice(selectedCell.rowIndex + 1)
        .map((row, index) => row[selectedCell.colIndex + index + 1]),
      currentPlayer
    );
    affectedCells = [
      ...affectedCells,
      ...diagonallyDownLeft.map(
        (_, index) =>
          `${selectedCell.rowIndex + index + 1},${
            selectedCell.colIndex - index - 1
          }`
      ),
    ];
    affectedCells = [
      ...affectedCells,
      ...diagonallyDownRight.map(
        (cell, index) =>
          `${selectedCell.rowIndex + index + 1},${
            selectedCell.colIndex + index + 1
          }`
      ),
    ];

    // return the board with the affected cells
    return affectedCells.reduce((acc, cell) => {
      const [rowIndex, colIndex] = cell.split(",");
      const currentCell = acc[parseInt(rowIndex)][parseInt(colIndex)];
      const updatedCell = {
        ...currentCell,
        isAffected: true,
      };
      acc[parseInt(rowIndex)][parseInt(colIndex)] = updatedCell;
      return acc;
    }, boardWithPendingMove);
  }, [board, boardWithValidMoves, currentPlayer, isCellValid, selectedCell]);

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (currentPlayerType === "computer") {
      return;
    }

    if (isCellValid(rowIndex, colIndex)) {
      dispatch(makeMove({ rowIndex, colIndex }));
    }
  };

  const handleCellHover = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (currentPlayerType === "computer") {
        return;
      }

      if (isCellValid(rowIndex, colIndex)) {
        setSelectedCell({ rowIndex, colIndex });
      }
    },
    [currentPlayerType, isCellValid]
  );

  const handleCellLeave = () => {
    setSelectedCell(null);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!!winner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center gap-4">
            <h2 className="text-3xl font-bold text-white">
              {winner === "W" ? "White" : "Black"} Wins!
            </h2>
            <Button
              onClick={() => {
                dispatch(finishGame());
                router.push("/");
              }}
              size="lg"
              className="cursor-pointer"
            >
              Finish
            </Button>
            <Button
              onClick={() => {
                setWinner(null);
              }}
              className="cursor-pointer"
            >
              View Board
            </Button>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center w-full px-4">
        {/* Player One (White) */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white border border-gray-300"></div>
          <span className="font-semibold">White ({playerWhiteType})</span>
          {currentPlayer === "W" && (
            <>
              <Hand size={24} weight="fill" className="text-green-500" />
            </>
          )}
          {currentPlayer === "B" && playerWhiteType === "computer" && (
            <Button
              className="cursor-pointer"
              onClick={() => {
                setShowThinkingDialog(true);
              }}
            >
              <Brain />
            </Button>
          )}
        </div>

        {/* Player Two (Black) */}
        <div className="flex items-center gap-2">
          {currentPlayer === "B" && (
            <>
              <Hand size={24} weight="fill" className="text-green-500" />
            </>
          )}
          {currentPlayer === "W" && playerBlackType === "computer" && (
            <Button
              className="cursor-pointer"
              onClick={() => {
                setShowThinkingDialog(true);
              }}
            >
              <Brain />
            </Button>
          )}
          <div className="w-8 h-8 rounded-full bg-black border border-gray-300"></div>
          <span className="font-semibold">Black ({playerBlackType})</span>
        </div>
      </div>
      {showThinkingDialog && playerBLastMoveDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center gap-4 max-w-2xl max-h-[400px] overflow-auto">
            <h2 className="text-2xl font-bold text-white">
              Computer&apos;s Thinking Process
            </h2>
            <div className="text-white whitespace-pre-wrap">
              {playerBLastMoveDetails.thinking}
            </div>
            <div className="text-white">
              <strong>Move:</strong> {playerBLastMoveDetails.move}
            </div>
            <Button
              onClick={() => setShowThinkingDialog(false)}
              size="lg"
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {showThinkingDialog && playerWLastMoveDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg flex flex-col items-center gap-4 max-w-2xl max-h-[400px] overflow-auto">
            <h2 className="text-2xl font-bold text-white">
              Computer&apos;s Thinking Process
            </h2>
            <div className="text-white whitespace-pre-wrap">
              {playerWLastMoveDetails.thinking}
            </div>
            <div className="text-white">
              <strong>Move:</strong> {playerWLastMoveDetails.move}
            </div>
            <Button
              onClick={() => setShowThinkingDialog(false)}
              size="lg"
              className="cursor-pointer"
            >
              Close
            </Button>
          </div>
        </div>
      )}
      <div
        className={`flex items-start gap-2 w-full h-16 ${
          currentPlayer === "W" ? "justify-start" : "justify-end"
        }`}
      >
        {currentPlayerType === "computer" && (
          <>
            <CircleNotch size={20} className="animate-spin text-green-500" />
            <span className="text-green-500">Thinking...</span>
          </>
        )}
      </div>
      <div className="grid grid-cols-8 grid-rows-8 gap-1 w-[600px] h-[600px] p-2 rounded-lg">
        {boardWithPendingMove.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            return (
              <BoardCell
                key={`${rowIndex}-${colIndex}`}
                cell={cell}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                onHover={() => handleCellHover(rowIndex, colIndex)}
                onLeave={handleCellLeave}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;
