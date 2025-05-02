import React from "react";
import { useAppSelector } from "../../store";
import { BoardCell } from "../molecules/BoardCell";

const GameBoard: React.FC = () => {
  const board = useAppSelector((state) => state.game.board);
  const currentPlayer = useAppSelector((state) => state.game.currentPlayer);

  console.log(board);
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-xl font-semibold">
        Current Turn: {currentPlayer === "B" ? "Black" : "White"}
      </div>
      <div className="grid grid-cols-8 grid-rows-8 gap-1 w-[600px] h-[600px] p-2 rounded-lg">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            return <BoardCell key={`${rowIndex}-${colIndex}`} token={cell} />;
          })
        )}
      </div>
    </div>
  );
};

export default GameBoard;
