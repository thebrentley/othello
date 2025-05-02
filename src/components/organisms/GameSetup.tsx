"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  setplayerWhiteType,
  setplayerBlackType,
  startGame,
} from "@/store/gameSlice";
import Button from "@/components/atoms/Button";
import { Swap } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function GameSetup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const playerWhiteType = useSelector(
    (state: RootState) => state.game.playerWhiteType
  );
  const playerBlackType = useSelector(
    (state: RootState) => state.game.playerBlackType
  );

  const togglePlayerType = (player: "one" | "two") => {
    const currentType = player === "one" ? playerWhiteType : playerBlackType;
    const newType = currentType === "human" ? "computer" : "human";
    if (player === "one") {
      dispatch(setplayerWhiteType(newType));
    } else {
      dispatch(setplayerBlackType(newType));
    }
  };

  const handleStartGame = () => {
    router.push("/game");

    dispatch(startGame());
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center justify-between w-full max-w-4xl px-8">
        {/* Player One */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full"></div>
            <h3 className="text-2xl font-semibold">White</h3>
          </div>
          <button
            onClick={() => togglePlayerType("one")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-700 hover:text-green-700 transition-all cursor-pointer"
          >
            <span className="text-xl">{playerWhiteType}</span>
            <Swap size={20} weight="bold" />
          </button>
        </div>

        {/* Center Button */}
        <Button
          size="lg"
          className="text-3xl px-12 py-6 cursor-pointer"
          onClick={handleStartGame}
        >
          Let&apos;s play
        </Button>

        {/* Player Two */}
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 border-white border-1 rounded-full"></div>
            <h3 className="text-2xl font-semibold">Black</h3>
          </div>
          <button
            onClick={() => togglePlayerType("two")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:border-green-700 hover:text-green-700 transition-all cursor-pointer"
          >
            <span className="text-xl">{playerBlackType}</span>
            <Swap size={20} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
