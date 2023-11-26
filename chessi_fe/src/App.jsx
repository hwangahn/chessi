import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, message } from 'antd';
import socket from './utils/socket';
import { useContext, useEffect } from 'react';
import { AuthContext } from './components/auth';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Game from './pages/game';

export default function App() {
  let { useSilentLogin } = useContext(AuthContext);

  useEffect(() => {
    socket.on("connect", async () => {
      let { status, msg } = await useSilentLogin();

      if (status === "error") {
        message.warning(msg);
      }
    });
    
    return () => {
      socket.off();
    }
  }, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route exact path='/' Component={Home}></Route>
				<Route path='/login' Component={Login}></Route>
				<Route path='/signup' Component={Signup}></Route>
				<Route path='/game/:gameid' Component={Game}></Route>
			</Routes>
			<FloatButton.BackTop visibilityHeight={100} />
		</BrowserRouter>
	)
}

