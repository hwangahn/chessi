import { Button, message } from 'antd';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../components/auth"
import { Link } from 'react-router-dom';
import socket from '../utils/socket';

export default function Home() {
  let { useLogout, accessToken, profile } = useContext(AuthContext);

  let [connected, setConnected] = useState(socket.connected);
  let [recovered, setRecovered] = useState(socket.recovered);

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(socket.connected);
      setRecovered(socket.recovered);
    });

    return () => {
      socket.off();
    }
  }, [])

  let handleLogout = async () => {
    let { status, msg } = await useLogout();

    (status === "ok") ? message.success(msg) : message.error(msg);

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
          <p>{`Recovered: ${recovered}`}</p>
          <Button type='primary' onClick={handleLogout}>Logout</Button>
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