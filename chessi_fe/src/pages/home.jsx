import { Button, message } from 'antd';


import { Link, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import socket from '../utils/socket';
import { AuthContext } from "../contexts/auth"
import { useContext, useEffect, useState } from "react"
import VerticalmenuUser from './verticalmenuUser';

export default function Home() {
  let navigate = useNavigate();

  let { useLogout, accessToken, profile } = useContext(AuthContext);

  let [connected, setConnected] = useState(socket.connected);
  let [isFindingGame, setIsFindingGame] = useState(false);

  useEffect(() => {
    socket.on("connect", async () => {
      setConnected(true);
    });

    socket.on("cannot find game", () => {
      setIsFindingGame(false);
      message.error("Cannot find game. Please try again");
    });

    socket.on("game found", (gameid) => {
      navigate(`/game/${gameid}`);
      setIsFindingGame(false);
    });

    return () => {
      socket.off("connect");
      socket.off("cannot find game");
      socket.off("game found");
    }
  }, []);

  useEffect(() => { // runs every re-render to get user's active game
    (async function() {
      console.log(accessToken);
      if (accessToken) {
        let rawData = await fetch('/api/user-active-game', {
          method: 'get',
          headers: {
            'authorization': 'Bearer ' + accessToken,
          }
        });

        let { status, inGame, gameid } = await rawData.json();

        if (status === "error") {
          message.warning(msg);
        } else if (inGame) {
          navigate(`/game/${gameid}`);
        }
      }
    })();
  })

  let handleLogout = async () => {
    let { status, msg } = await useLogout();

    (status === "ok") ? message.success(msg) : message.error(msg);
  }

  const handleFindGame = async () => {
    if (socket.connected) {
      if (!isFindingGame) {
        try {
          let rawData = await fetch('/api/find-game', { // request to join match making queue
            method: "post",
            headers: {
              'authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
            }
          });

          let data = await rawData.json();

          data.status === "ok" ? setIsFindingGame(true) : message.error(data.msg);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          let rawData = await fetch('/api/find-game', { // request to leave match making queue
            method: "delete",
            headers: {
              'authorization': 'Bearer ' + accessToken,
              'Content-Type': 'application/json',
            }
          });

          let data = await rawData.json();      

          data.status === "ok" ? setIsFindingGame(false) : message.error(data.msg);
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      message.error("Cannot connect to server");
    }
  }

  let handleTestDisconnect = () => {
    if (socket.io.engine) {
      // close the low-level connection and trigger a reconnection
      socket.io.engine.close();
      setConnected(socket.connected);
    }
  }

  const introduce = {marginLeft: "212px", padding: "5px 0px", color:"#B0ABAB", textAlign: "center",
  borderBottom: "2px solid #2C2B4D", fontSize: "1.6vw", fontWeight: "bold"}

  const title = {position: "relative", color: "#00ace3", fontWeight: "bold", fontSize: "3vw",
  top:"5vw", left: "15vw", width: "19vw"}

  return (
    <div>
      {accessToken ? 
        <>
            <VerticalmenuUser />

          <div className="introduce" style={introduce}>
            👋Hello {profile.username}! <br/>
            Let's play a game.
          </div>

          <div className="game-screen" style={{display: "flex",padding: "0px",margin: "0px"}}>
            <div className="board" style={{width: "46%"}}>
              <Chessboard id={0} arePiecesDraggable={false} />              
            </div>
            <div className="play">
              <div className="title" style={title}>So tài cờ vua</div>
              <div className="game-play" style={{display: "flex", justifyContent: "space-between"}}>
                <div className="gp1">
                  {!isFindingGame ?
                    <div id="gm1" className="game-mode" onClick={handleFindGame}>Chơi với người</div>
                    : 
                    <div className="game-mode" onClick={handleFindGame}>Cancel</div>
                  }
                  <div id="gm2" className="game-mode">
                    <Link to ="/new">Chơi với bạn</Link>
                  </div>
                </div>
                <div className="gp2">
                  <div id="gm3" className="game-mode">
                    <Link to ="/new">Chơi với máy</Link>
                  </div>
                  <div id="gm4" className="game-mode">
                    <Link to ="/new">Xem lại trận đấu</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </> : 
        <>
          <Link to={"/login"}><Button type='primary' style={{marginRight: "10px"}}>Login</Button></Link>
          <Link to={"/signup"}><Button>Signup</Button></Link>
        </>
      }
    </div>
  )}