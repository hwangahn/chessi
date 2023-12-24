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
import forgotPassword from './pages/forgotPassword';
import History from './pages/History';
import './pages/TrangChu.css';
import FriendList from './pages/FriendList';
import Ranking from './pages/Ranking';
import ProtectedRoute from './components/protectedRoute';
import AdminAllUser from './pages/adminAllUser';
import AdminActiveUser from './pages/adminActiveUser';
import GameHistory from './pages/gameHistory';


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
        <Route path='/gamehistory' Component={GameHistory}></Route>
				<Route path='/docs' Component={APIdocs}></Route>
        <Route path='/history' Component={History}></Route>
        <Route path='/friendlist' Component={FriendList}></Route>
        <Route path='/ranking' Component={Ranking}></Route>
        <Route path='/admin' Component={AdminAllUser}></Route>
        <Route path='/admin/active-user' Component={AdminActiveUser}></Route>
        <Route Component={ProtectedRoute}> 
				</Route>
        <Route path='/forgot-password' Component={forgotPassword}></Route>

			</Routes>
			<FloatButton.BackTop visibilityHeight={100} />
		</BrowserRouter>
	)
}

