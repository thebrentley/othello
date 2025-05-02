import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlayerType = "human" | "computer";

interface GameState {
  playerWhiteType: PlayerType;
  playerBlackType: PlayerType;
  isStartingGame: boolean;
  isGameStarted: boolean;
  board: string[][];
  currentPlayer: "B" | "W";
}

const initialState: GameState = {
  playerWhiteType: "human",
  playerBlackType: "computer",
  isStartingGame: false,
  isGameStarted: false,
  currentPlayer: "W",
  board: [
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ],
};

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setplayerWhiteType: (state, action: PayloadAction<PlayerType>) => {
      state.playerWhiteType = action.payload;
    },
    setplayerBlackType: (state, action: PayloadAction<PlayerType>) => {
      state.playerBlackType = action.payload;
    },
    startGame: (state) => {
      state.isStartingGame = true;
      const newBoard = state.board.map((row) => [...row]);
      newBoard[3][3] = "W";
      newBoard[4][4] = "W";
      newBoard[3][4] = "B";
      newBoard[4][3] = "B";
      state.board = newBoard;
      state.currentPlayer = "W";
    },
    finishStartingGame: (state) => {
      state.isStartingGame = false;
      state.isGameStarted = true;
    },
    abandonGame: (state) => {
      state.isGameStarted = false;
      state.board = initialState.board;
    },
  },
});

export const {
  setplayerWhiteType,
  setplayerBlackType,
  startGame,
  abandonGame,
  finishStartingGame,
} = gameSlice.actions;
export default gameSlice.reducer;
