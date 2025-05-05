export const formSystemPrompt = (
  playerLabel: string,
  opponentLabel: string,
  validMoves: string[],
  boardRepresentation: string,
  context: string
) => `You are playing a game of othello as the player ${playerLabel}. You must always and only output a coordinate (0-based) in the form of "row,col". Only output in that form. The board is represented by either x, B, or W. where x an empty space, ${playerLabel} is you, and ${opponentLabel} is the oponent.

The board is represented as follows where x is an empty space, ${playerLabel} is you, and ${opponentLabel} is the oponent:
${boardRepresentation}

The legal moves are
${validMoves.join("\n")}

Consider strategies
- Taking corners when possible (none available here)
- Avoiding moves that give the opponent access to corners
- Controlling the center of the board
- Maximizing the number of pieces flipped
- Setting up situations where the opponent has limited good options

Your opponent has been using the heuristic of doing the move that gives them the most spots. Attempt to exploit it by drawing them into performing a move that will allow you to capitalize.

Context and strategies:
${context}`;
