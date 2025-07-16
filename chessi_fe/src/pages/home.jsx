import { Button, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import socket from '../utils/socket';
import { AuthContext } from "../contexts/auth"
import { useContext, useEffect, useState } from "react"
import VerticalmenuUser from '../components/verticalmenuUser';
import UseGetGame from '../utils/useGetGame';
import UseGetTournament from '../utils/useGetTournament';
import JoinGameBanner from '../components/home/joinGameBanner';
import JoinTournamentBanner from '../components/home/joinTournamentBanner';

export default function Home() {
  const [popup, setPop] = useState(false);

  let navigate = useNavigate();

  let { accessToken, profile } = useContext(AuthContext);

  let [isFindingGame, setIsFindingGame] = useState(false);

  let gameid = UseGetGame({ accessToken });
  let tournamentid = UseGetTournament({ accessToken });

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

  const handleFindGame = async () => {
    if (socket.connected) {
      if (!isFindingGame) {
        try {
          let rawData = await fetch('/api/game/find-game', { // request to join match making queue
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
          let rawData = await fetch('/api/game/find-game', { // request to leave match making queue
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


  const handleCreateCompGame = () => {
    if (socket.connected) {
      navigate(`/play-computer/`);
    }
  }

  let handleClickOpen = () => {
    setPop(!popup);
  }

  function Gallery() {
    const gallery = {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      position: "absolute",
      height: "91vh",
      width: "100vw",
      zIndex: "1"
    }

    const createTournamentInner = {
      width: "500px",
      position: "relative",
      top: "30%",
      margin: "auto",
      background: "white",
    }

    const createTournamentHeader = {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      background: "#242337",
      color: "white"
    }

    const createTournamentBody = {
      paddingTop: "30px",
      textAlign: "center"
    }

    const createTournamentBodyInput = {
      width: "100%",
      height: "40px",
      fontSize: "25px",
      textAlign: "center",
      border: "none",
      outline: "none"
    }

    const createTournamentFooter = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "right"
    }

    const createTournamentFooterButton = {
      padding: "10px 100px",
      color: "white",
      background: "#242337",
      border: "none",
      outline: "none",
      borderRadius: "5px",
      cursor: "pointer"
    }

    let handleCreateTournament = async () => {
      if (tournamentName !== "") {
        let rawData = await fetch(`/api/tournament/create`, { // join lobby
          method: 'post',
          body: JSON.stringify({
            name: tournamentName
          }),
          headers: {
            'authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }
        });

        let data = await rawData.json();

        if (data.status === "error") {
          message.error(data.msg);
          navigate('/');
        } else {
          navigate(`/tournament/${data.tournamentid}`);
        }
      }
    }

    let [tournamentName, setTournamentName] = useState("");

    return (
      <>
        {popup ?
          <div style={gallery}>
            <div style={createTournamentInner}>
              <div style={createTournamentHeader}>
                <p>Create Tournament</p>
                <img src="x-regular-24.png" onClick={handleClickOpen} style={{ cursor: "pointer" }} />
              </div>
              <div style={createTournamentBody}>
                <input style={createTournamentBodyInput} value={tournamentName} type="text" id="tournament-name" placeholder="Tournament name" onChange={(e) => { setTournamentName(e.target.value) }} />
              </div>
              <div style={createTournamentFooter}>
                <button style={createTournamentFooterButton} onClick={handleCreateTournament}>Create</button>
              </div>
            </div>
          </div>
          : ""}
      </>
    );
  }

  const introduce = {
    marginLeft: "14.1vw", padding: "5px 0px", color: "#B0ABAB", textAlign: "center",
    borderBottom: "2px solid #2C2B4D", fontSize: "1.6vw", fontWeight: "bold"
  }

  return (
    <div>
      {accessToken ?
        <>
          <Gallery />
          <VerticalmenuUser />
          <div className="introduce" style={introduce}>
            👋 Hello {profile.username}! <br />
            Let's play a game.
          </div>

          <div className="game-screen" style={{ display: "flex", padding: "0px", margin: "0px", marginLeft: "14.1vw" }}>
            <div className="board" style={{ width: "46%" }}>
              <Chessboard id={0} customDarkSquareStyle={{ backgroundColor: "#6d7fd1" }} />
            </div>


            <div id="play-container" className="flex flex-col justify-around gap-[40px] w-[54%] p-[30px]">
              {
                tournamentid ? <JoinTournamentBanner tournamentid={tournamentid} /> : ""
              }
              {
                gameid ?
                  <JoinGameBanner gameid={gameid} /> :
                  <div id="game-play" className="flex flex-row justify-between">
                    <div className="flex flex-col gap-[30px]">
                      {!isFindingGame ?
                        <div id="gm1" className="game-btn" onClick={handleFindGame}>Quick play</div>
                        :
                        <div id="gm1" className="game-btn" onClick={handleFindGame} style={{ color: "red" }}>Cancel</div>
                      }
                      <div id="gm2" className="game-btn" onClick={handleClickOpen}>Create tournament</div>
                    </div>
                    <div className="flex flex-col gap-[30px]">
                      <div id="gm3" className="game-btn" onClick={handleCreateCompGame}>Play with computer</div>
                      <div id="gm4" className="game-btn" onClick={handleCreateLobby}>Create lobby</div>
                    </div>
                  </div>
              }
            </div>
          </div>
        </> : ""
      }
    </div>
  )
}