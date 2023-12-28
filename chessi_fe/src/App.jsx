import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, Spin, message } from 'antd';
import socket from './utils/socket';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './contexts/auth';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Game from './pages/game';
import Header from './pages/header';
import APIdocs from './pages/api-docs';
import ForgotPassword from './pages/forgotPassword';
import History from './pages/History';
import './pages/TrangChu.css';
import FriendList from './pages/FriendList';
import Ranking from './pages/Ranking';
import ProtectedRoute from './components/protectedRoute';
import Admin from './pages/admin';

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
          <Route path='/login' Component={Login}></Route>
          <Route path='/signup' Component={Signup}></Route>
          <Route path='/game/:roomid' Component={Game}></Route>
          <Route path='/docs' Component={APIdocs}></Route>
          <Route path='/history/:userid' Component={History}></Route>
          <Route path='/friendlist' Component={FriendList}></Route>
          <Route path='/ranking' Component={Ranking}></Route>
          <Route Component={ProtectedRoute}> 
            <Route path='/admin' Component={Admin} />
          </Route>
          <Route path='/forgot-password' Component={ForgotPassword}></Route>
         </Routes>
        <FloatButton.BackTop visibilityHeight={100} />
      </BrowserRouter>
    )
  )
}

