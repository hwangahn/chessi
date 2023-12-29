import { useNavigate } from 'react-router-dom';
import { Affix, message } from 'antd';
import './TrangChu.css';
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/auth"
import { useContext } from "react"

export default function verticalmenuUser(){
    let navigate = useNavigate();

    let { useLogout } = useContext(AuthContext);

    let handleLogout = async () => {
        let { status, msg } = await useLogout();
    
        (status === "ok") ? message.success(msg) : message.error(msg);

        if (status === "ok") {
            navigate('/');
        }
      }

    const leftbar = {display:"inline", float:"left", width: "14.1vw", height: "45.3vw",
    borderRight: "2px solid #2C2B4D", marginTop: "-8px"}

    return(
        <Affix offsetTop={60}>
            <div id="leftbar" style={leftbar}>
                <ul className="single-vertical-menu">
                    <li>
                        <img src="../../public/choi.png" alt=""/>
                        <Link to ="/">Chơi</Link>
                    </li> 
                    <li>
                        <img src="../../public/friend.png" alt=""/>
                        <Link to ="/friendlist">Bạn bè</Link>
                    </li>
                    <li>
                        <img src="../../public/history.png" alt=""/>
                        <Link to ="/history">Lịch sử đấu</Link>
                    </li>
                    <li>
                        <img src="../../public/diendan.png" alt=""/>
                        <Link to ="/new">Diễn đàn</Link>
                    </li>
                    <li>
                        <img src="../../public/ranking.png" alt=""/>
                        <Link to ="/ranking">Bảng xếp hạng</Link>
                    </li>	
                </ul>	
                <div className="logoutButton">
                    <img src="../../public/logout-button.png" alt="" style={{float: "left", marginLeft: "15%", marginTop : "0.75vw", width: "1.6vw"}}/>
                    <span onClick={handleLogout} style={{color:"#FFFFFF", float: "left", marginLeft: "10%", marginTop : "0.85vw", fontSize: "1.1vw"}}>Log out</span>
                </div>	
            </div>
        </Affix>
    )
}

