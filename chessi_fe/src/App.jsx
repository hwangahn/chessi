import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, message } from 'antd';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import socket from './utils/socket';
import { useContext, useEffect } from 'react';
import { AuthContext, ProfileContext } from './components/auth';

export default function App() {
  let { setAccessToken, sessionToken, setSessionToken } = useContext(AuthContext);
  let { setProfile } = useContext(ProfileContext);

  useEffect(() => {
    socket.on("connect", () => {
      if (sessionToken) {
        fetch("/api/gettoken", {
          method: "post",
          headers: {
            'authorization': 'Bearer ' + sessionToken,
            'Content-Type': 'application/json',
          }, 
          body: JSON.stringify({
            socketID: socket.id
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.status === "error") {
            setSessionToken(null);
            message.error(data.msg);
          } else {
            setAccessToken(data.accessToken);
            setProfile(data.profile);
          }
        });
      }
    })
  }, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route exact path='/' Component={Home}></Route>
				<Route path='/login' Component={Login}></Route>
				<Route path='/signup' Component={Signup}></Route>
			</Routes>
			<FloatButton.BackTop visibilityHeight={100} />
		</BrowserRouter>
	)
}

