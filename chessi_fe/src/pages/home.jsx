import { Button } from 'antd';
import { useContext } from "react"
import { AuthContext, ProfileContext } from "../components/auth"

export default function Home() {
  let { accessToken, setAccessToken, setSessionToken } = useContext(AuthContext);
  let { profile, setProfile } = useContext(ProfileContext);

  let handleLogout = () => {
    setAccessToken(null);
    setSessionToken(null);
    setProfile(null);
  }

  return (
    <div>
      {accessToken ? 
        <>
          <p>Hello {profile.username}</p>
          <Button type='primary' onClick={handleLogout}>Logout</Button>
        </> : 
        <>
          <a href='/login'><Button type='primary' style={{marginRight: "10px"}}>Login</Button></a>
          <a href='/signup'><Button>Signup</Button></a>
        </>
      }
    </div>
  )
}