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
    <div id="move" style={{display: "block", width: "100%", height: "2vw", marginTop: "0.3vw"}}>
      <div style={{float: "left", width: "5.8%", marginLeft: "5px"}}>
        <p>{moveOrder + 1}</p>
      </div>
      <div style={{float: "left", width: "45%"}}>
        <Button type={isOnMove === movePair[0].moveIndex ? "primary" : "default"} onClick={() => handleClick(movePair[0])} style={{width: "100%", height: "2vw", fontSize: "1vw"}}>{movePair[0].history.san}</Button>
      </div>
      <div style={{float: "left", width: "45%"}}>
        {movePair[1].history && 
        <Button type={isOnMove === movePair[1].moveIndex ? "primary" : "default"} onClick={() => handleClick(movePair[1])} style={{width: "100%", height: "2vw", fontSize: "1vw"}}>{movePair[1].history.san}</Button>}
      </div>
    </div>
  )
}