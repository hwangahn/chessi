import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { message } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import { GameContent, GameContentContext } from "../contexts/gameContent";
import MoveHistory from "../components/game/moveHistory";

function GameInfo() {
  let { setPosition, setOnMove, history, setHistory } = useContext(GameContentContext);

  let [playerInfo, setPlayerInfo] = useState(null);

  let param = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let rawData = await fetch(`/api/game/played/${param.gameid}`, {
        method: 'get'
      });

      let data = await rawData.json();

      if (data.status === "ok") {
        setHistory(() => {
          data.moves.forEach(Element => {
            history.push({ color: Element.side, san: Element.notation, after: Element.fen });
          });
          return [...history];
        });
        setPosition(data.moves[data.moves.length - 1].fen);
        setPlayerInfo({ white: data.white, black: data.black });
        setOnMove(data.moves.length - 1);
      } else {
        message.error(data.msg);
        navigate('/'); // return to main page
      }
    })()
  }, []);

  const playerComponent = {
    display: "flex",
    flexDirection: "row",
  }

  const playerAva = {
    margin: "0.3vw 0vw 0.5vw 0vw",
    width: "20vw",
    color: "#B0ABAB",
    fontSize: "1.6vw",
    fontWeight: "bold"
  }

  const gameComponent = {
    backgroundColor: "#1E1D2F",
    width: "93%",
    height: "17vw",
  }

  const gc1 = {
    width: "100%",
    backgroundColor: "rgb(45, 44, 69)",
    color: "white",
    height: "2vw",
    padding: "0.4vw 0.5vw",
    fontSize: "1.1vw",
  }

  return (
    <>
      <div style={playerComponent}>
        <div style={playerAva}>
          <UserOutlined style={{ width: "2vw", height: "3vw" }} />
          {`${playerInfo?.black?.username} (${playerInfo?.black?.rating})`}
        </div>
      </div>
      <div style={gameComponent}>
        <MoveHistory />
      </div>
      <div style={playerComponent}>
        <div style={playerAva}>
          <UserOutlined style={{ width: "2vw", height: "3vw" }} />
          {`${playerInfo?.white?.username} (${playerInfo?.white?.rating})`}
        </div>
      </div>
    </>
  );
}

function Board() {
  let { position } = useContext(GameContentContext);

  return (
    <>
      <Chessboard id={1000000000} position={position} arePiecesDraggable={false} animationDuration={0} customDarkSquareStyle={{ backgroundColor: "#6d7fd1" }} />
    </>
  )
}

export default function Game() {
  const leftbar = {
    float: "left",
    width: "27.5%",
    marginTop: "0px",
    paddingTop: "0.8vw",
    paddingLeft: "2vw"
  };

  const gameInfor = {
    backgroundColor: "#1E1D2F",
    color: "#BEC1DC",
    width: "92%",
    height: "10vw",
    marginBottom: "1.5vw"
  }

  const rightbar = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "4%",
    marginTop: "28%",
    justifyContent: "center"
  }

  return (
    <GameContent>
      <div style={leftbar}>
        <div className="lb1">
          <div style={gameInfor}></div>
        </div>
      </div>
      <div id="game-board" style={{ float: "left", width: "42%" }}>
        <Board />
      </div>
      <div id="game-misc" style={{ float: "right", width: "30%" }}>
        <div style={rightbar}>
          <GameInfo />
        </div>
      </div>
    </GameContent>
  )
}