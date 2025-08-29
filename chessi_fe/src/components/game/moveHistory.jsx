import { useEffect, useRef, useContext } from "react";
import { Button } from "antd";
import { GameContentContext } from "../../contexts/gameContent";

export default function MoveHistory() {
  let { game, history, setPosition, isOnMove, setOnMove } = useContext(GameContentContext);

  let lastMove = useRef(null);

  useEffect(() => {
    lastMove.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  let handleClick = (move, index) => {
    setOnMove(index); // set selected move. may not be latest move
    setPosition(move.after); // position after making selected move

    game.load(move.after, { skipValidation: true });
  }

  return (
    <div className="w-full h-[100%] mb-[calc(20vw*0.05)] overflow-y-auto bg-gray-900">
      <div className="grid grid-cols-[40px_1fr_1fr]">
        {history.map((Element, index) => {
          let rowNum = Math.ceil(index / 2) + 1;
          let isRowStart = Element.color === "white" || Element.color === "w" || index === 0;

          return (
            <>
              {isRowStart && (
                <div
                  className="flex items-center justify-center font-bold text-gray-500 bg-gray-900 col-start-1 font-large"
                  key={`moveNum-${index}`}
                >
                  {rowNum}
                </div>
              )}

              <Button
                key={index}
                className={`
                  h-[40px] rounded-none text-white border-gray-600 font-semibold font-large
                  ${Element.color === "black" || Element.color === "b" ? "col-start-3" : ""}
                  ${Element.color === "white" || Element.color === "w" ? "col-start-2" : ""}
                  ${isOnMove === index ? "bg-[rgb(109,127,209)]" : "bg-[rgb(30,29,47)]"}
                `}
                onClick={() => handleClick(Element, index)}
              >
                {Element.san}
              </Button>
            </>
          );
        })}
        <div ref={lastMove} style={{ height: "0px" }}></div>
      </div>
    </div>
  )
}
