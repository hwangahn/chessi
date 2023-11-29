import { useContext } from "react";
import { Button } from "antd";
import { GameContentContext } from "../contexts/gameContent";

export default function Move({ movePair, moveOrder }) {
  let { setPosition, isOnMove, setOnMove } = useContext(GameContentContext);

  let handleClick = (move) => {
    setOnMove(move.moveIndex); // set selected move. may not be latest move
    setPosition(move.history.after); // position after making selected move
  }

  return (
    <div id="move" style={{display: "block", width: "100%", height: "50px"}}>
      <div style={{float: "left", width: "10%"}}>
        <p>{moveOrder + 1}</p>
      </div>
      <div style={{float: "left", width: "45%"}}>
        <Button type={isOnMove === movePair[0].moveIndex ? "primary" : "default"} onClick={() => handleClick(movePair[0])} style={{width: "100%", height: "50px"}}>{movePair[0].history.san}</Button>
      </div>
      <div style={{float: "right", width: "45%"}}>
        {movePair[1].history && 
        <Button type={isOnMove === movePair[1].moveIndex ? "primary" : "default"} onClick={() => handleClick(movePair[1])} style={{width: "100%", height: "50px"}}>{movePair[1].history.san}</Button>}
      </div>
    </div>
  )
}