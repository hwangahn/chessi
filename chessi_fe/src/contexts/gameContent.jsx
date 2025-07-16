import { createContext, useState } from "react";

export const GameContentContext = createContext(null);

export function GameContent({ children }) {
	let [side, setSide] = useState(null);
  let [position, setPosition] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  let [history, setHistory] = useState(new Array); // move and board history
  let [isOnMove, setOnMove] = useState(-1); // the move that is selected. the game state is now set to after this move
	let [timeLeft, setTimeLeft] = useState(null);
	let [blackTime, setBlackTime] = useState(null);
	let [whiteTime, setWhiteTime] = useState(null);


  return (
    <GameContentContext.Provider value={{ side, setSide, position, setPosition, history, setHistory, isOnMove, setOnMove, whiteTime, setWhiteTime, blackTime, setBlackTime }}>
      {children}
    </GameContentContext.Provider>
  )
}