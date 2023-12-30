import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, Spin, message } from 'antd';
import socket from './utils/socket';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './contexts/auth';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Game from './pages/game';
import Header from './components/header';
import APIdocs from './pages/api-docs';
import ForgotPassword from './pages/forgotPassword';
import History from './pages/History';
import './components/TrangChu.css';
import FriendList from './pages/FriendList';
import Ranking from './pages/Ranking';
import ProtectedRouteAdmin from './components/protectedRouteAdmin';
import ProtectedRouteUser from './components/protectedRouteUser';
import AdminAllUser from './pages/adminAllUser';
import AdminActiveUser from './pages/adminActiveUser';
import Lobby from './pages/lobby';
import GameHistory from './pages/gameHistory';
import Search from './pages/Search'
import ChangePassword from './pages/changePassword';

//test
export default function App() {
  let [ isLoading, setLoading ] = useState(true);

  let { useSilentLogin } = useContext(AuthContext);

  useEffect(() => {
    socket.on("connect", async () => {
      let { status, msg } = await useSilentLogin();

      setLoading(false);

      if (status === "error") {
        message.warning(msg);
      }
    });
    
    return () => {
      socket.off("connect");
    }
  }, []);

	return (
    (isLoading === true ? 
      <BrowserRouter>
        <Routes>
          <Route path='/' Component={Spin}></Route>
        </Routes>
      </BrowserRouter> : 
      <BrowserRouter>
        <Header />
        <Routes>
          <Route exact path='/' Component={Home}></Route>
          <Route path='/search' Component={Search}></Route>
          <Route path='/login' Component={Login}></Route>
          <Route path='/signup' Component={Signup}></Route>
          <Route path='/game/played/:gameid' Component={GameHistory}></Route>
          <Route path='/game/:roomid' Component={Game}></Route>
          <Route path='/lobby/:lobbyid' Component={Lobby}></Route>
          <Route path='/docs' Component={APIdocs}></Route>
          <Route path='/user/:userid' Component={History}></Route>
          <Route path='/friendlist' Component={FriendList}></Route>
          <Route path='/ranking' Component={Ranking}></Route>
          <Route path='/admin' Component={AdminAllUser}></Route>
          <Route path='/admin/active-user' Component={AdminActiveUser}></Route>
          <Route Component={ProtectedRouteAdmin}> 
 
          </Route>
          <Route Component={ProtectedRouteUser}> 
 
          </Route>
          <Route path='/forgot-password' Component={ForgotPassword}></Route>
          <Route path='/change-password' Component={ChangePassword}></Route>
         </Routes>
        <FloatButton.BackTop visibilityHeight={100} />
      </BrowserRouter>
    )
  )
}

