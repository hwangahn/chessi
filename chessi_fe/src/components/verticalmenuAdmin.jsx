import './TrangChu.css';
import { Link } from 'react-router-dom';
import { Affix, message } from 'antd';
import { AuthContext } from "../contexts/auth"
import { useContext } from "react"

export default function verticalmenuAdmin(){

    let { useLogout, profile } = useContext(AuthContext);

    let handleLogout = async () => {
        let { status, msg } = await useLogout();
    
        (status === "ok") ? message.success(msg) : message.error(msg);
      }

    const leftbar = {display:"inline", float:"left", width: "14.1vw", height: "45.3vw",
    borderRight: "2px solid #2C2B4D", marginTop: "-8px"}

    return(
        <>
            {
                profile && profile.isAdmin &&
                <Affix offsetTop={60}>
                    <div id="leftbar" style={leftbar}>
                        <ul className="single-vertical-menu">
                            <li>
                                <img src="../../public/choi.png" alt=""/>
                                <Link to ="/admin/all-user">All user</Link>
                            </li> 
                            <li>
                                <img src="../../public/choi.png" alt=""/>
                                <Link to ="/admin/active-user">Active user</Link>
                            </li>
                            <li>
                                <img src="../../public/choi.png" alt=""/>
                                <Link to ="/admin/all-admin">All admin</Link>
                            </li>
                            <li>
                                <img src="../../public/choi.png" alt=""/>
                                <Link to ="/admin/add-admin">Add admin</Link>
                            </li>
                            <li>
                                <img src="../../public/choi.png" alt=""/>
                                <Link to ="/admin/all-game">All game</Link>
                            </li>
                            <li>
                                <img src="../../public/diendan.png" alt=""/>
                                <Link to ="/post">Post</Link>
                            </li>		
                        </ul>	
                        <div className="logoutButton">
                            <img src="../../public/logout-button.png" alt="" style={{float: "left", marginLeft: "15%", marginTop : "0.75vw", width: "1.6vw"}}/>
                            <span onClick={handleLogout} style={{color:"#FFFFFF", float: "left", marginLeft: "10%", marginTop : "0.85vw", fontSize: "1.1vw"}}>Log out</span>
                        </div>	
                    </div>
                </Affix>
            }
        </>
    )
}

