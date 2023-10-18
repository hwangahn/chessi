import { Button } from 'antd';
import { useContext } from "react"
import { AuthContext, ProfileContext } from "../components/auth"
import { useNavigate } from 'react-router-dom';

export default function Home() {
  let { accessToken, setAccessToken, setSessionToken } = useContext(AuthContext);
  let { profile, setProfile } = useContext(ProfileContext);
  let navigate = useNavigate();

  let handleLogout = () => {
    setAccessToken(null);
    setSessionToken(null);
    setProfile(null);

    fetch("/api/logout", {
      method: "post",
      headers: {
        'authorization': 'Bearer ' + accessToken,
      }
    });
  }

  return (
    <div>
      {accessToken ? 
        <>
          <p>Hello {profile.username}</p>
          <Button type='primary' onClick={handleLogout}>Logout</Button>
        </> : 
        <>
          <Button type='primary' style={{marginRight: "10px"}} onClick={() => navigate("/login")} >Login</Button>
          <Button onClick={() => navigate("/signup")}>Signup</Button>
        </>
      }
    </div>
  )
}