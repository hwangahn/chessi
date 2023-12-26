import './TrangChu.css';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/auth"
import { useContext } from "react"

export default function verticalmenuAdmin(){

    let { useLogout } = useContext(AuthContext);

    let handleLogout = async () => {
        let { status, msg } = await useLogout();
    
        (status === "ok") ? message.success(msg) : message.error(msg);
      }

    const leftbar = {display:"inline", float:"left", width: "14.1vw", height: "45vw", marginTop: "0px",
    borderRight: "2px solid #2C2B4D"}

    return(
        <>
        <div id="leftbar" style={leftbar}>
            <ul className="single-vertical-menu">
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/admin">All user</Link>
                </li> 
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/admin/active-User">Active user</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/admin/all-Admin">All admin</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/admin/all-Game">All game</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/admin/diendan">Diễn đàn</Link>
                </li>		
            </ul>	
            <div className="logoutButton">
                <img src="logout-button.png" alt="" style={{float: "left", marginLeft: "15%", marginTop : "0.75vw", width: "1.6vw"}}/>
                <span onClick={handleLogout} style={{color:"#FFFFFF", float: "left", marginLeft: "10%", marginTop : "0.85vw", fontSize: "1.1vw"}}>Log out</span>
            </div>	
        </div>
        </>
    )
}

