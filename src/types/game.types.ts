export type PlayerType = "human" | "computer";
export type Token = "W" | "B" | "";

export interface BoardCell {
  token: string;
  isPreview?: boolean;
  isCellValid?: boolean;
  isAffected?: boolean;
}

export interface GameState {
  playerWhiteType: PlayerType;
  playerBlackType: PlayerType;
  isStartingGame: boolean;
  isGameStarted: boolean;
  board: Token[][];
  currentPlayer: Token;
  playerBLastMoveDetails: {
    move: string;
    thinking: string;
  } | null;
  playerWLastMoveDetails: {
    move: string;
    thinking: string;
  } | null;
}

export interface ValidMove {
  rowIndex: number;
  colIndex: number;
}
