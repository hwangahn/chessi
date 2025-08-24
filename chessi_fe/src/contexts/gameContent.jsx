import { createContext, useState, useRef } from "react";
import { Chess } from "chess.js";

export const GameContentContext = createContext(null);

const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"

export function GameContent({ children }) {
  let gameRef = useRef(new Chess(STARTING_POSITION));
  let game = gameRef.current;
	let [side, setSide] = useState("white");
  let [position, setPosition] = useState(game.fen()); // the current position of the board
  let [history, setHistory] = useState(new Array); // move and board history
  let [isOnMove, setOnMove] = useState(-1); // the move that is selected. the game state is now set to after this move
	let [blackTime, setBlackTime] = useState(null);
	let [whiteTime, setWhiteTime] = useState(null);


  return (
    <GameContentContext.Provider value={{ game, side, setSide, position, setPosition, history, setHistory, isOnMove, setOnMove, whiteTime, setWhiteTime, blackTime, setBlackTime }}>
      {children}
    </GameContentContext.Provider>
  )
}