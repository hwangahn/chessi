import { Button, message } from 'antd';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/auth"
import { Link, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

export default function Home() {
  let navigate = useNavigate();

  let { useLogout, accessToken, profile } = useContext(AuthContext);

  let [connected, setConnected] = useState(socket.connected);
  let [isFindingMatch, setIsFindingMatch] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(socket.connected);
    });

    socket.on("cannot find match", () => {
      setIsFindingMatch(false);
      message.error("Cannot find match. Please try again");
    });

    socket.on("match found", (roomid) => {
      // navigate(`/game/${roomid}`);
      setIsFindingMatch(false);
      message.success(`Match found! Game room ${roomid}`);
    });

    return () => {
      socket.off();
    }
  }, [])

  let handleLogout = async () => {
    let { status, msg } = await useLogout();

    (status === "ok") ? message.success(msg) : message.error(msg);
  }

  const handleFindMatch = async () => {
    if (!isFindingMatch) {
      try {
        let rawData = await fetch('/api/find-match', { // request to join match making queue
          method: "post",
          headers: {
            'authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }
        });

        let data = await rawData.json();

        data.status === "ok" ? setIsFindingMatch(true) : message.error(data.msg);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        let rawData = await fetch('/api/stop-find-match', { // request to leave match making queue
          method: "post",
          headers: {
            'authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
          }
        });

        let data = await rawData.json();      

        data.status === "ok" ? setIsFindingMatch(false) : message.error(data.msg);
      } catch (error) {
        console.error(error);
      }
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
          <p>Hello {profile.username}</p>
          <p>{`Status: ${connected}`}</p>
          <Button type='primary' onClick={handleLogout} style={{marginRight: "10px"}}>Logout</Button>
          <Button type='primary' onClick={handleFindMatch} style={{marginRight: "10px"}}>{!isFindingMatch ? "Find match" : "Cancel"}</Button>
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