"use client";
import GameSetup from "@/components/organisms/GameSetup";
import Game from "./game/page";
import { useAppDispatch, useAppSelector } from "@/store";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import { abandonGame } from "@/store/gameSlice";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isGameStarted = useAppSelector((state) => state.game.isGameStarted);

  const handleRejoinGame = () => {
    router.push("/game");
  };

  const handleAbandonGame = () => {
    dispatch(abandonGame());
  };

  return (
    <main>
      {isGameStarted ? (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-bold">You have a game in progress</h1>
          <Button
            className="bg-green-700 text-xl text-white cursor-pointer"
            onClick={handleRejoinGame}
          >
            Rejoin Game
          </Button>
          <Button
            className="bg-red-700 text-xl hover:bg-red-800 text-white cursor-pointer"
            onClick={handleAbandonGame}
          >
            Adandon Game
          </Button>
        </div>
      ) : (
        <GameSetup />
      )}
    </main>
  );
}
