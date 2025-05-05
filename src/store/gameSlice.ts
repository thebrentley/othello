import { getOutflankCells, getValidMoves } from "@/utils/game.utils";
import { formSystemPrompt } from "@/utils/prompt.utils";
import Anthropic from "@anthropic-ai/sdk";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { QdrantClient } from "@qdrant/js-client-rest";
import { Document } from "@langchain/core/documents";
import { VoyageEmbeddings } from "@langchain/community/embeddings/voyage";
import {
  CORNER_STABLE_FORCE_STRATEGY,
  CORNER_STABLE_STRATEGY,
} from "../../constants";

export type PlayerType = "human" | "computer";

interface GameState {
  playerWhiteType: PlayerType;
  playerBlackType: PlayerType;
  isStartingGame: boolean;
  isGameStarted: boolean;
  board: string[][];
  currentPlayer: "B" | "W";
  playerBLastMoveDetails: {
    move: string;
    thinking: string;
  } | null;
  playerWLastMoveDetails: {
    move: string;
    thinking: string;
  } | null;
  lastPlayerTurnSkipped: boolean;
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
  playerBLastMoveDetails: null,
  playerWLastMoveDetails: null,
  lastPlayerTurnSkipped: false,
};

const qdrantClient = new QdrantClient({
  url: process.env.NEXT_PUBLIC_QDRANT_URL || "http://localhost:6333",
  apiKey: process.env.NEXT_PUBLIC_QDRANT_API_KEY,
});

const anthropic = new Anthropic({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
});

const embeddings = new VoyageEmbeddings({
  apiKey: process.env.NEXT_PUBLIC_VOYAGE_API_KEY,
  modelName: "voyage-3",
});

// async function getEmbeddings(text: string): Promise<number[]> {
//   const doc = new Document({
//     pageContent: text,
//   });
//   const docEmbeddings = await embeddings.embedDocuments([doc.pageContent]);
//   return docEmbeddings[0];
// }

export async function insertKnowledge(id: string, key: string, text: string) {
  const doc = new Document({
    pageContent: text,
    metadata: {
      key,
    },
  });
  const vector = await embeddings.embedDocuments([doc.pageContent]);

  await qdrantClient.upsert("othello", {
    points: [
      {
        id: parseInt(id),
        vector: vector[0],
        payload: {
          text,
          key,
        },
      },
    ],
  });
}

const handlePoorResponse = (response: string) => {
  // from the response, extract the row and col
  // TODO: implement this
  console.error("Poor response from Claude:", response);
};

export const makeComputerMove = createAsyncThunk(
  "game/makeComputerMove",
  async (_, { getState, dispatch }) => {
    const state = getState() as { game: GameState };
    const { board, currentPlayer } = state.game;

    // Find all valid moves
    const validMoves = getValidMoves(board, currentPlayer);

    if (validMoves.length > 0) {
      try {
        // Create text input for understanding the current game state and the strategies that should be used
        let strategyContext = "";

        // if there is a valid move along one of the edges or adjacent to an edge, add that to the strategy input
        if (
          validMoves.some(
            (move) =>
              move.rowIndex === 0 ||
              move.rowIndex === 7 ||
              move.colIndex === 0 ||
              move.colIndex === 7 ||
              (move.rowIndex === 1 && move.colIndex === 1) ||
              (move.rowIndex === 1 && move.colIndex === 6) ||
              (move.rowIndex === 6 && move.colIndex === 1) ||
              (move.rowIndex === 6 && move.colIndex === 6)
          )
        ) {
          strategyContext += " " + CORNER_STABLE_STRATEGY;
        } else {
          strategyContext += " " + CORNER_STABLE_FORCE_STRATEGY;
        }

        const systemPrompt = formSystemPrompt(
          currentPlayer,
          currentPlayer === "B" ? "W" : "B",
          validMoves.map((move) => `${move.rowIndex},${move.colIndex}`),
          board
            .map((row) =>
              row.map((cell) => (cell === "" ? "x" : cell)).join("")
            )
            .join("\n"),
          strategyContext
        );

        const msg = await anthropic.messages.create({
          model: "claude-3-7-sonnet-20250219",
          max_tokens: 1050,
          thinking: {
            type: "enabled",
            budget_tokens: 1024,
          },
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content:
                "Please make your move based on the current game state. Consider the strategies.",
            },
          ],
        });

        const textResponse = msg.content.find(
          (contentBlock) => contentBlock.type === "text"
        )?.text;

        const thinkingResponse = msg.content.find(
          (contentBlock) => contentBlock.type === "thinking"
        )?.thinking;

        if (!textResponse) {
          console.error("Could not extract AI response", msg);
          return;
        }

        if (currentPlayer === "B") {
          dispatch(
            setPlayerBLastMoveDetails({
              move: textResponse,
              thinking: thinkingResponse || "",
            })
          );
        } else if (currentPlayer === "W") {
          dispatch(
            setPlayerWLastMoveDetails({
              move: textResponse,
              thinking: thinkingResponse || "",
            })
          );
        }

        const move = textResponse.match(/(\d+),(\d+)/);
        if (move) {
          dispatch(
            makeMove({
              rowIndex: parseInt(move[1]),
              colIndex: parseInt(move[2]),
            })
          );
        } else {
          handlePoorResponse(textResponse);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
);

// Add this thunk for inserting knowledge
export const insertKnowledgeAction = createAsyncThunk(
  "game/insertKnowledge",
  async ({ id, key, text }: { id: string; key: string; text: string }) => {
    await insertKnowledge(id, key, text);
  }
);

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
      state.currentPlayer = "B";
      state.lastPlayerTurnSkipped = false;
    },
    finishStartingGame: (state) => {
      state.isStartingGame = false;
      state.isGameStarted = true;
      state.lastPlayerTurnSkipped = false;
    },
    abandonGame: (state) => {
      state.isGameStarted = false;
      state.board = initialState.board;
      state.lastPlayerTurnSkipped = false;
    },
    finishGame: (state) => {
      state.isGameStarted = false;
      state.board = initialState.board;
      state.lastPlayerTurnSkipped = false;
    },
    setPlayerBLastMoveDetails: (
      state,
      action: PayloadAction<{ move: string; thinking: string }>
    ) => {
      state.playerBLastMoveDetails = action.payload;
    },
    setPlayerWLastMoveDetails: (
      state,
      action: PayloadAction<{ move: string; thinking: string }>
    ) => {
      state.playerWLastMoveDetails = action.payload;
    },
    skipTurn: (state) => {
      state.currentPlayer = state.currentPlayer === "W" ? "B" : "W";
      state.lastPlayerTurnSkipped = true;
    },
    resetLastPlayerTurnSkipped: (state) => {
      state.lastPlayerTurnSkipped = false;
    },
    makeMove: (
      state,
      action: PayloadAction<{ rowIndex: number; colIndex: number }>
    ) => {
      const { rowIndex, colIndex } = action.payload;
      const currentPlayer = state.currentPlayer;
      const newBoard = state.board.map((row) => [...row]);

      // go right and see if there is a valid move
      const row = newBoard[rowIndex];

      // right
      let cells = row.slice(colIndex + 1);
      const rightOutflankCells = getOutflankCells(cells, currentPlayer);
      if (rightOutflankCells.length > 0) {
        for (let i = 0; i < rightOutflankCells.length; i++) {
          newBoard[rowIndex][colIndex + i + 1] = currentPlayer;
        }
      }

      // left
      cells = row.slice(0, colIndex).reverse();
      const leftOutflankCells = getOutflankCells(cells, currentPlayer);
      if (leftOutflankCells.length > 0) {
        for (let i = 0; i < leftOutflankCells.length; i++) {
          newBoard[rowIndex][colIndex - i - 1] = currentPlayer;
        }
      }

      // up
      cells = newBoard
        .slice(0, rowIndex)
        .map((row) => row[colIndex])
        .reverse();
      const upOutflankCells = getOutflankCells(cells, currentPlayer);
      if (upOutflankCells.length > 0) {
        for (let i = 0; i < upOutflankCells.length; i++) {
          newBoard[rowIndex - i - 1][colIndex] = currentPlayer;
        }
      }

      // down
      cells = newBoard.slice(rowIndex + 1).map((row) => row[colIndex]);
      const downOutflankCells = getOutflankCells(cells, currentPlayer);
      if (downOutflankCells.length > 0) {
        for (let i = 0; i < downOutflankCells.length; i++) {
          newBoard[rowIndex + i + 1][colIndex] = currentPlayer;
        }
      }

      // up left
      cells = newBoard
        .slice(0, rowIndex)
        .reverse()
        .map((row, index) => row[colIndex - index - 1]);
      const upLeftOutflankCells = getOutflankCells(cells, currentPlayer);
      if (upLeftOutflankCells.length > 0) {
        for (let i = 0; i < upLeftOutflankCells.length; i++) {
          newBoard[rowIndex - i - 1][colIndex - i - 1] = currentPlayer;
        }
      }

      // up right
      cells = newBoard
        .slice(0, rowIndex)
        .reverse()
        .map((row, index) => row[colIndex + index + 1]);
      const upRightOutflankCells = getOutflankCells(cells, currentPlayer);
      if (upRightOutflankCells.length > 0) {
        for (let i = 0; i < upRightOutflankCells.length; i++) {
          newBoard[rowIndex - i - 1][colIndex + i + 1] = currentPlayer;
        }
      }

      // down left
      cells = newBoard
        .slice(rowIndex + 1)
        .map((row, index) => row[colIndex - index - 1]);
      const downLeftOutflankCells = getOutflankCells(cells, currentPlayer);
      if (downLeftOutflankCells.length > 0) {
        for (let i = 0; i < downLeftOutflankCells.length; i++) {
          newBoard[rowIndex + i + 1][colIndex - i - 1] = currentPlayer;
        }
      }

      // down right
      cells = newBoard
        .slice(rowIndex + 1)
        .map((row, index) => row[colIndex + index + 1]);
      const downRightOutflankCells = getOutflankCells(cells, currentPlayer);
      if (downRightOutflankCells.length > 0) {
        for (let i = 0; i < downRightOutflankCells.length; i++) {
          newBoard[rowIndex + i + 1][colIndex + i + 1] = currentPlayer;
        }
      }

      newBoard[rowIndex][colIndex] = currentPlayer;
      state.board = newBoard;

      // switch player
      state.currentPlayer = currentPlayer === "W" ? "B" : "W";
      state.lastPlayerTurnSkipped = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(makeComputerMove.pending, () => {
        // You could add loading state here if needed
      })
      .addCase(makeComputerMove.fulfilled, () => {
        // Handle successful computer move
      })
      .addCase(makeComputerMove.rejected, (_, action) => {
        console.error("Computer move failed:", action.error);
      });
  },
});

export const {
  setplayerWhiteType,
  setplayerBlackType,
  startGame,
  abandonGame,
  finishStartingGame,
  finishGame,
  makeMove,
  setPlayerBLastMoveDetails,
  setPlayerWLastMoveDetails,
  skipTurn,
  resetLastPlayerTurnSkipped,
} = gameSlice.actions;
export default gameSlice.reducer;
