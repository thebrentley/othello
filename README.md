# Othello

## Quickstart

### Prerequisites

- Environment
  Copy .env.example to .env (just need an anthropic api key)

### Install dependencies and Run it

```
npm install
npm start
```

Go to http://localhost:3000

### Run dev

```
npm install
npm run dev
```

## Approach

Used cursor for IDE (I'm pretty new to it, so this was the first time I've used it from the get-go). Pretty heavy on setup--not that I didn't know how to do it, but rather because it can be tedious to scaffold things out. I could have used npx, but I was admittidly curious to try it out and see how it did. Consensus is pretty good, I'd say :)

Firstly, I went through setting up the UI. My thought was to get it working to the point where I could play human vs human so I could have a solid base before digging into the UI. I've never played or heard of othello, so I wasn't familiar with the rules. Tried to play on eothello, but didn't get much from that since you have to wait for other players. I was probably a little overeager to get to the AI part, so I made some assumptions regarding the rules that I had to go back and get working properly.

UI: I thought it'd be neat to be able to show exactly what the move is going to do when you hover over a potential move. It helped me with testing because I could easily click on the circle that flipped the most pieces (I know that's not always the best move now...). I used redux to manage state. It's pretty simple with only one reducer, but leaves a lot of room for expansion. I used redux persist to make sure reloads didn't wipe out the game (definitely useful while implementing and fixing issues). If you leave and come back (to the home screen), you'll be prompted to rejoin or abandon your current game.

AI: Started with a pretty simple prompt with claude 3.7, using thinking (which I briefly played around with in the console first) that laid out the board structure, shared the board, listed some good strategies, and asked for the best move. I noticed it was spending a lot of time determining valid moves. That wasn't really necessary and cost-effective to do that since I already had to calculate that for the UI, so I added that to it.
One tricky part is making sure it always outputs in the correct format. I had some fallbacks in place which I never actually got around to implementing. At the moment they just log when it occurs. I played several games and it never happened, but, regardless, it's on the todo list.
After playing with that set for a bit, I was able to beat it pretty easy. It was at a novice level. It was at this point that I actually researched strategies and such. From that, the conditional prompt pieces in constants.ts was born. Initially I went through putting this in a vectordb so I could do a rag, but when I got around to doing the retrieval, it seemed very unnecessary at current, since my input was not very dynamic. The general idea is that based on the current board we can change up our prompt by adding additional context in the form of strategy. After I added this part, it did very well and beat me handily.

## Some future ideas

- Generate a summary of the opponents heuristic and feed that to the prompt when determining next move
  After each non-computer move, look at what move was taken. Together with past moves, attempt to formulate what type of player the opponent is. Are they greedy / flip as many pieces as possible? Do they like quiet moves? Loud moves? Do they like edges, etc. This attributes can be used in the main system prompt to bait out the opponents tendencies.
- Research: Create a history of the moves (maybe in combination with last point) to see if there are any details about the way the game is being played. For example, does the opponent fall into specific traps that were set up?
- RAG for specific board/turn sequences. The board is a vector so we can look for direct matches easily in certain cases where there is an objectively ideal move, regardless of opponent heuristics
