import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Spin, Button, message } from 'antd'
import { UserOutlined } from '@ant-design/icons';
import socket from "../utils/socket";
import { AuthContext } from "../contexts/auth";
import { GameContent, GameContentContext } from "../contexts/gameContent";
import MoveHistory from "../components/game/moveHistory";
import Chat from "../components/chat";

function GameInfo() {
  let { profile } = useContext(AuthContext);
  let { side, setSide, setPosition, setOnMove, history, setHistory, whiteTime, setWhiteTime, blackTime, setBlackTime } = useContext(GameContentContext);

  let [playerInfo, setPlayerInfo] = useState(null);
  let [turn, setTurn] = useState(null);

  let param = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    let joinRoom = () => {
      socket.emit("join room", param.roomid);
    }

    let getGameInfo = async () => {
      let rawData = await fetch(`/api/game/${param.roomid}`, {
        method: 'get'
      });

      let data = await rawData.json();

      if (data.status === "ok") {
        setHistory(() => {
          data.gameInfo.history.forEach(Element => { history.push(Element) });
          return [...history];
        });
        setPosition(data.gameInfo.position);
        setPlayerInfo({ white: data.gameInfo.white, black: data.gameInfo.black });
        setWhiteTime(data.gameInfo.whiteTimeLeft);
        setBlackTime(data.gameInfo.blackTimeLeft);
        setTurn(data.gameInfo.turn);
        setOnMove(data.gameInfo.history.length - 1);
        if (profile) {
          if (data.gameInfo.white.username === profile.username) {
            setSide("white");
          } else if (data.gameInfo.black.username === profile.username) {
            setSide("black");
          } else {
            setSide("spectator");
          }
        } else {
          setSide("spectator");
        }
      } else {
        message.error(data.msg);
        navigate('/'); // return to main page
      }
    }

    socket.on("time left", (turn, whiteTimeLeft, blackTimeLeft) => { // update game timer
      // setWhiteTime(whiteTime);
      // setBlackTime(blackTime);
      setWhiteTime(whiteTimeLeft);
      setBlackTime(blackTimeLeft);
      setTurn(turn);
    })

    socket.on("connect", async () => {
      joinRoom();
      getGameInfo();
    });

    socket.on("game over", (reason) => {
      message.success(reason, 10);
    })

    if (socket.connected) {
      joinRoom();
      getGameInfo();
    } else {
      message.warning("Cannot connect to server");
    }

    return () => {
      socket.off("time left");
      socket.off("connect");
      socket.off("game over");
    }
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

  const playerTimer = {
    color: "#B0ABAB",
    fontSize: "1.6vw",
    marginTop: "0.8vw",
    paddingTop: "0.33vw",
    backgroundColor: "#1E1D2F",
    width: "6.5vw",
    height: "2.4vw",
    textAlign: "center",
    borderRadius: "15px"
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
          {
            side === "spectator" ? // if is spectator
              `${playerInfo?.black?.username} (${playerInfo?.black?.rating})` // render black further away
              : // else
              (side === 'black' ? // if player's side is black, render white here, else render black
                `${playerInfo?.white?.username} (${playerInfo?.white?.rating})` :
                `${playerInfo?.black?.username} (${playerInfo?.black?.rating})`)
          }
        </div>
        <div style={playerTimer}>
          {
            side === "spectator" ? // if is spectator
              `${blackTime}` // render black time further away
              : // else
              (side === "black" ? // if player's side is black, render white here, else render black
                `${whiteTime}` : `${blackTime}`)
          }
        </div>
      </div>
      <div style={gameComponent}>
        <MoveHistory />
      </div>
      <div style={playerComponent}>
        <div style={playerAva}>
          <UserOutlined style={{ width: "2vw", height: "3vw" }} />
          {
            side === "spectator" ? // if is spectator
              `${playerInfo?.white?.username} (${playerInfo?.white?.rating})` // render white nearer
              : // else
              side === "white" ? // if player's side is white, render white here, else render black
                `${playerInfo?.white?.username} (${playerInfo?.white?.rating})` :
                `${playerInfo?.black?.username} (${playerInfo?.black?.rating})`
          }
        </div>
        <div style={playerTimer}>
          {
            side === "spectator" ? // if is spectator
              `${whiteTime}` // render white nearer
              : // else
              side === "white" ? // if player's side is white, render white here, else render black
                `${whiteTime}` : `${blackTime}`
          }
        </div>
      </div>
    </>
  );
}

function Board() {
  let { side, position, setPosition, history, setHistory, setOnMove, isOnMove } = useContext(GameContentContext);

  let param = useParams();

  let isLatestMove = history.length - 1 === isOnMove; // check whether the selected move (in turn change the state of the game based on the position when the move is made) is latest

  useEffect(() => {
    socket.on("move made", (move) => {
      history.push(move);
      setHistory([...history]);
      setPosition(move.after);
      setOnMove(history.length - 1); // selecting latest move
    });

    return () => {
      socket.off("move made");
    }
  }, []);

  let handlePieceDrop = (sourceSquare, targetSquare, piece) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() // promotion dialog returns the piece as the promoted piece, not the pawn
    };

    if (isLatestMove && piece.substring(0, 1) === side[0]) { // wrong side
      socket.emit("make move", param.roomid, move);
    }

    return false;
  }

  return (
    <>
      {
        side ?
          <Chessboard id={1000000000} position={position} onPieceDrop={handlePieceDrop} boardOrientation={side} customBoardStyle={{ width: "100%" }} animationDuration={0} customDarkSquareStyle={{ backgroundColor: "#6d7fd1" }} /> :
          <Spin />
      }
      {side}
    </>
  )
}

export default function Game() {

  let params = useParams();

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
        <div className="lb2" style={{ color: "#BEC1DC" }}>
          <Chat roomid={params.gameid} />
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