import { Button, message } from 'antd';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/auth"
import { Link, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

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
      socket.off();
    }
  }, []);

  useEffect(() => { // runs every re-render to get user's active game
    (async function() {
      console.log(accessToken);
      if (accessToken) {
        let rawData = await fetch('/api/get-users-active-game', {
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
          let rawData = await fetch('/api/stop-find-game', { // request to leave match making queue
            method: "post",
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

  return (
    <div>
      {accessToken ? 
        <>
          <p>{`Hello ${profile.username}`}</p>
          <p>{`Rating: ${profile.rating}`}</p>
          <p>{`Status: ${connected}`}</p>
          <Button type='primary' onClick={handleLogout} style={{marginRight: "10px"}}>Logout</Button>
          {!isFindingGame ? 
          <Button type='primary' onClick={handleFindGame} style={{marginRight: "10px", width: "100px"}}>Find Game</Button>
          : 
          <Button danger onClick={handleFindGame} style={{marginRight: "10px", width: "100px"}}>Cancel</Button>
          }
          <Button onClick={handleTestDisconnect}>Test disconnect</Button>
        </> : 
        <>
          <Link to={"/login"}><Button type='primary' style={{marginRight: "10px"}}>Login</Button></Link>
          <Link to={"/signup"}><Button>Signup</Button></Link>
        </>
      }
    </div>
  )
}