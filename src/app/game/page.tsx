"use client";
import GameBoard from "@/components/organisms/GameBoard";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { finishStartingGame } from "@/store/gameSlice";
import { useEffect } from "react";

export default function Game() {
  const isStartingGame = useSelector(
    (state: RootState) => state.game.isStartingGame
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isStartingGame) {
      dispatch(finishStartingGame());
    }
  }, [isStartingGame, dispatch]);

  return (
    <main>
      {isStartingGame && (
        <div className="flex items-center justify-center h-screen w-screen">
          Starting game...
        </div>
      )}
      {!isStartingGame && (
        <div className="container mx-auto p-4">
          <GameBoard />
        </div>
      )}
    </main>
  );
}
