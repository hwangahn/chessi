import {Link} from 'react-router-dom';
import './TrangChu.css';
import { useState, useEffect,useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "../contexts/auth"
import {message} from 'antd';
export default function verticalmenu(){
    let navigate = useNavigate();

    let { profile } = useContext(AuthContext);
    const leftbar = {display:"inline", float:"left", width: "14.1vw", height: "45vw", marginTop: "0px",
    borderRight: "2px solid #2C2B4D"}


    const logoutButton = {
        backgroundColor: "#1E1D2F",
        color: "#232237",
        width: "70%",
        height: "3vw",
        border: "none",
        borderRadius: "2.5vw",
        marginLeft: "15%",
        marginTop: "2vw",
      }
      const userId= profile.userid;
    return(
        <>
        <div id="leftbar" style={leftbar}>
            <ul className="single-vertical-menu">
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/">Chơi</Link>
                </li> 
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/new">Câu đố</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/new">Theo dõi</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/friendlist">Bạn bè</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ={`/history/${userId}`} > Lịch sử đấu</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/new">Diễn đàn</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/ranking">Bảng xếp hạng</Link>
                </li>
                <li>
                    <img src="choi.png" alt=""/>
                    <Link to ="/new">Premium</Link>
                </li>		
            </ul>	
            <div style={logoutButton}>
                <img src="logout-button.png" alt="" style={{float: "left", marginLeft: "15%", marginTop : "0.75vw", width: "1.6vw"}}/>
                <span style={{color:"#FFFFFF", float: "left", marginLeft: "10%", marginTop : "0.85vw", fontSize: "1.1vw"}}>Log out</span>
            </div>	
        </div>
        </>
    )
}

