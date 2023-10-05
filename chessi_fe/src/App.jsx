import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { FloatButton, message } from 'antd';
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import { useContext, useEffect } from 'react';
import { AuthContext, ProfileContext } from './components/auth';

export default function App() {
  let { accessToken, setAccessToken, sessionToken, setSessionToken } = useContext(AuthContext);
  let { setProfile } = useContext(ProfileContext);

  useEffect(() => {
    if (sessionToken) {
      fetch("/api/gettoken", {
        method: "post",
        headers: {
          'authorization': 'Bearer ' + sessionToken
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "error") {
          message.error(data.msg);
          setSessionToken(null);
        } else {
          setAccessToken(data.accessToken);
          setProfile(data.profile);
        }
      });
    }

    return () => {
      if (accessToken) {
        fetch("/api/leave", {
          method: "post",
          headers: {
            'authorization': 'Bearer ' + accessToken
          }
        });
      }
    }
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

