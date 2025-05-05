export const CORNER_STABLE_STRATEGY =
  "Perhaps the most basic strategy in Othello is to take the corners. By the rules of play, it is impossible to flip a disc in a corner, so that if you are able to take a corner, that disc will be yours for the rest of the game. Moreover, once you have a corner, it is often possible to build a large number of discs that are protected by the corner and can never be flipped. Such discs are called stable discs. The possibility of building up stable discs usually makes corners very valuable, especially early in the game. If taking corners is that good, then it should be obvious that you usually do not want to give any to your opponent! Given the rules of the game, the only way for your opponent to take a corner is if you play in one of the squares next to a corner, so it is generally a good idea to avoid these spaces. Once a corner is taken, all the pieces in that row and column become stable and can never be outflanked. To avoid the opponent from being able to obtain a corner square, avoid placing your token in a diagonally adjacent location to a corner. Be wary of placing a token in a corner adjacent location if possible. In most cases, it is dangerous to place your token in one of these locations, but can be okay in some situations that you are certain the opponent won't be able to obtain the corner space.";

export const CORNER_STABLE_FORCE_STRATEGY = `To force the opponent to make a move that places their token in a corner adjacent (good thing for you), use this strategy: Many novices choose their moves mainly on the basis of the number of discs that are flipped, with the more discs flipped the better. After all, the object of the game is to end up with as many pieces as possible, so it seems logical to want to take a lot of pieces at every point during the game. For example, consider the board
xxxxxxxx
xxxxxxxx
xBBBBBWW
xBBBBBWx
xWBBWWWB
WWWWWWWx
xxxxWxxx
xxxxxxxx

If you play at 0,3, their next move might be 0,2 (Since the flips a lot of pieces). If you then play 0,1, they are forced to play 1,1, which gives you the corner at 0,0.
`;
