import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { message } from 'antd'
import socket from "../utils/socket";

export default function Game() {
  let [gameInfo, setGameInfo] = useState(null);

  let param = useParams();
  
  useEffect(() => {
    let changeGameTime; // game clock interval ref

    let joinRoom = () => {
      socket.emit("join room", param.gameid);
    }

    let getGameInfo = async () => {
      let rawData = await fetch(`/api/game-info/${param.gameid}`, {
        method: 'get'
      });

      let data = await rawData.json();

      if (data.status === "ok") {
        setGameInfo(data.gameInfo);

        changeGameTime = setInterval(() => { // game clock
          // update game time
          setGameInfo(prev => ({
            ...prev,
            timeLeft: prev.timeLeft > 0 ? --prev.timeLeft : 0
          }));
        }, 1000);
      } else {
        message.error(data.msg);
      }
    }

    socket.on("connect", async () => {
      joinRoom();
      getGameInfo();
    });
    
    socket.on("game over", (reason) => {
      message.success(reason);
    })
    
    if (socket.connected) {
      joinRoom();
      getGameInfo();
    } else {
      message.warning("Cannot connect to server");
    }

    return () => {
      socket.off();
      clearInterval(changeGameTime);
    }
  }, [])

  return (
    <>
      <p>{`White: ${gameInfo?.white?.username} (${gameInfo?.white?.rating})`}</p>
      <p>{`Black: ${gameInfo?.black?.username} (${gameInfo?.black?.rating})`}</p>
      <p>{`Time left: ${gameInfo?.timeLeft}`}</p>
    </>
  )
}