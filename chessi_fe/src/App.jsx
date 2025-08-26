import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FloatButton, Spin, message } from 'antd';
import socket from './utils/socket';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from './contexts/auth';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Game from './pages/game';
import Header from './components/header';
import APIdocs from './pages/apiDocs';
import ForgotPassword from './pages/forgotPassword';
import User from './pages/User';
import './index.css';
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
import Post from './pages/createPost';
import PostDetail from './pages/postDetail';
import AdminHome from './pages/adminHome';
import AdminAllAdmin from './pages/adminAllAdmin';
import AdminAddAdmin from './pages/adminAddAdmin';
import CompLobby from './pages/compLobby';
import Tournament from './pages/tournament';
import PastTournament from './pages/pastTournament';
import StatusBar from './utils/status';
import ActiveTournament from './pages/activeTournaments';
import EditStudyChapter from './pages/editStudyChapter';
import EditStudy from './pages/editStudy';
import Studies from './pages/studies';
import './css/input.css';
import "./css/modal.css"
import './css/empty.css'

//test
export default function App() {
  let [isLoading, setLoading] = useState(true);

  let { useSilentLogin } = useContext(AuthContext);

  useEffect(() => {
    const handleConnect = async () => {
      const { status, msg } = await useSilentLogin();
      setLoading(false);
      if (status === "error") {
        message.warning(msg);
      }
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect(); // Manually call if already connected
    }

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
          <Route path='/post/:postid' Component={PostDetail}></Route>
          <Route path='/search' Component={Search}></Route>
          <Route path='/login' Component={Login}></Route>
          <Route path='/signup' Component={Signup}></Route>
          <Route path='/game/played/:gameid' Component={GameHistory}></Route>
          <Route path='/game/:roomid' Component={Game}></Route>
          <Route path='/docs' Component={APIdocs}></Route>
          <Route path='/user/:userid' Component={User}></Route>
          <Route Component={ProtectedRouteAdmin}>
            <Route path='/admin' Component={AdminHome}></Route>
            <Route path='/admin/all-user' Component={AdminAllUser}></Route>
            <Route path='/admin/active-user' Component={AdminActiveUser}></Route>
            <Route path='/admin/all-admin' Component={AdminAllAdmin}></Route>
            <Route path='/admin/add-admin' Component={AdminAddAdmin}></Route>
            <Route path='/admin/all-game' Component={AdminAllUser}></Route>
          </Route>
          <Route Component={ProtectedRouteUser}>
            <Route path='/lobby/:lobbyid' Component={Lobby}></Route>
            <Route path="/studies" Component={Studies}></Route>
            <Route path="/study/:studyid/edit" Component={EditStudy}></Route>
            <Route path="/study/:studyid/chapter/:chapterid/edit" Component={EditStudyChapter}></Route>
            <Route path="/tournaments/" Component={ActiveTournament}></Route>
            <Route path="/tournament/:tournamentid" Component={Tournament}></Route>
            <Route path="/tournament/past/:tournamentid" Component={PastTournament}></Route>
            <Route path='/play-computer' Component={CompLobby}></Route>
            <Route path='/following' Component={FriendList}></Route>
            <Route path='/ranking' Component={Ranking}></Route>
            <Route path='/post' Component={Post}></Route>
            <Route path='/change-password' Component={ChangePassword}></Route>
          </Route>
          <Route path='/forgot-password' Component={ForgotPassword}></Route>
        </Routes>
        <FloatButton.BackTop visibilityHeight={100} />
        <StatusBar />
      </BrowserRouter>
    )
  )
}

