import { Button } from 'antd';
import { useContext } from "react"
import { AuthContext } from "../components/auth"
import { Link } from 'react-router-dom';

export default function Home() {
  let { accessToken, profile, logout } = useContext(AuthContext);

  let handleLogout = () => {
    logout();

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
          <Link to={"/login"}><Button type='primary' style={{marginRight: "10px"}}>Login</Button></Link>
          <Link to={"/signup"}><Button>Signup</Button></Link>
        </>
      }
    </div>
  )
}