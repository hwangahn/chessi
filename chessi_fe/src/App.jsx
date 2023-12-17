import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, message } from 'antd';
import socket from './utils/socket';
import { useContext, useEffect } from 'react';
import { AuthContext } from './contexts/auth';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Game from './pages/game';
import Header from './pages/header';
import APIdocs from './pages/api-docs';
import History from './pages/History';
import "./pages/view.css";
import './pages/TrangChu.css'
import Verticalmenu from './pages/verticalmenu';
import FriendList from './pages/FriendList';
import Ranking from './pages/Ranking';

//test
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
      socket.off("connect");
    }
  }, []);

	return (
		<BrowserRouter>
      <Header />
			<Routes>
				<Route exact path='/' Component={Home}></Route>
				<Route path='/login' Component={Login}></Route>
				<Route path='/signup' Component={Signup}></Route>
				<Route path='/game/:roomid' Component={Game}></Route>
				<Route path='/docs' Component={APIdocs}></Route>
        <Route path='/history' Component={History}></Route>
        <Route path='/friendlist' Component={FriendList}></Route>
        <Route path='/ranking' Component={Ranking}></Route>
			</Routes>
			<FloatButton.BackTop visibilityHeight={100} />
		</BrowserRouter>
	)
}
