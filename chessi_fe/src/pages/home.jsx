import { Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import socket from '../utils/socket';
import { AuthContext } from "../contexts/auth"
import { useContext, useEffect, useState } from "react"
import VerticalmenuUser from '../components/verticalmenuUser';
import UseGetGame from '../utils/useGetGame';
import UseGetLobby from '../utils/useGetLobby';


export default function Home() {
  const [popup, setPop] = useState(false);

  let navigate = useNavigate();

  let { useLogout, accessToken, profile } = useContext(AuthContext);

  let [isFindingGame, setIsFindingGame] = useState(false);

  UseGetGame({accessToken});
  UseGetLobby({accessToken});

  useEffect(() => {
    socket.on("cannot find game", () => {
      setIsFindingGame(false);
      message.error("Cannot find game. Please try again");
    });

    socket.on("game found", (gameid) => {
      navigate(`/game/${gameid}`);
      setIsFindingGame(false);
    });

    return () => {
      socket.off("cannot find game");
      socket.off("game found");
    }
  }, []);


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

  const handleCreateLobby = async () => {
    if (socket.connected) {
      try {
        let rawData = await fetch('/api/lobby', { // request create lobby
          method: "post",
          headers: {
            'authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }
        });

        let data = await rawData.json();

        if (data.status !== "ok") {
          message.error(data.msg);
        } else {
          navigate(`/lobby/${data.lobbyid}`);
        }
      } catch (error) {
        console.error(error);
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

  let handleClickOpen = () => {
    setPop(!popup);
  }

  function Gallery(){
    const gallery = {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      position: "absolute",
      height: "91vh",
      width: "100vw",
      zIndex: "1"
    }

    const findGameInner = {
      width: "500px",
      position: "relative",
      top: "30%",
      margin: "auto",
      background: "white",
    }

    const findGameHeader = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      background: "#242337",
      color: "white"
    }

    const findGameBody = {
      paddingTop: "30px",
      textAlign: "center"
    }

    const findGameBodyInput = {
      width: "100%",
      height: "40px",
      fontSize: "25px",
      textAlign: "center",
      border: "none",
      outline: "none"
    }

    const findGameFooter = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "right"
    }

    const findGameFooterButton = {
      padding: "10px 100px",
      color: "white",
      background: "#242337",
      border: "none",
      outline: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }

    return(
      <>
        {popup?
          <div style={gallery}>
              <div style={findGameInner}>
                  <div style={findGameHeader}>
                      <p>Find Game</p>
                      <img src="x-regular-24.png" onClick={handleClickOpen} style = {{cursor: "pointer"}}/>
                  </div>
                  <div style={findGameBody}>
                      <input style={findGameBodyInput} type="text" id="roomID" placeholder="roomID" />
                  </div>
                  <div style={findGameFooter}>
                      <button style={findGameFooterButton} onClick={handleClickOpen}>Find Game</button>
                  </div>
              </div>
          </div>
        :""}
      </>
    );
  } 

  const introduce = {marginLeft: "212px", padding: "5px 0px", color:"#B0ABAB", textAlign: "center",
  borderBottom: "2px solid #2C2B4D", fontSize: "1.6vw", fontWeight: "bold"}

  const title = {position: "relative", color: "#00ace3", fontWeight: "bold", fontSize: "3.4vw",
  top:"5vw", left: "18.2vw", width: "19vw"}

  return (
    <div>
      {accessToken ? 
        <>
          <Gallery />
          <VerticalmenuUser />
          <div className="introduce" style={introduce}>
            👋Hello {profile.username}! <br/>
            Let's play a game.
          </div>

          <div className="game-screen" style={{display: "flex",padding: "0px",margin: "0px", marginLeft:"14.1vw"}}>
            <div className="board" style={{width: "46%"}}>
              <Chessboard id={0} arePiecesDraggable={false} />              
            </div>
            <div className="play">
              <div className="title" style={title}>Chessi</div>
              <div className="game-play" style={{display: "flex", justifyContent: "space-between"}}>
                <div className="gp1">
                  {!isFindingGame ?
                    <div id="gm1" className="game-btn" onClick={handleFindGame}>Quick play</div>
                    : 
                    <div id="gm1" className="game-btn" onClick={handleFindGame} style={{color: "red"}}>Cancel</div>
                  }
                  <div id="gm2" className="game-btn" onClick={handleClickOpen}>Join lobby</div>
                </div>
                <div className="gp2">
                  <div id="gm3" className="game-btn">
                    <Link to ="/new">Play with computer</Link>
                  </div>
                  <div id="gm4" className="game-btn" onClick={handleCreateLobby}>
                    Create lobby
                  </div>
                </div>
              </div>
            </div>
          </div>
        </> : ""
      }
    </div>
  )}