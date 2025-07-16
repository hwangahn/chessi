import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CrownOutlined } from '@ant-design/icons';
import { AuthContext } from '../contexts/auth';
import VerticalmenuUser from '../components/verticalmenuUser';
import { message } from 'antd';
import socket from '../utils/socket';
import view from './view.module.css';


function Info() {
    let { accessToken } = useContext(AuthContext);

    let [black, setBlack] = useState({
        username: "Computer", 
        isCreator: false
    });
    let [white, setWhite] = useState({
        username: "User",
        isCreator: true
    });

    let navigate = useNavigate();

    let handleSwitchSide = async () => {
        let trueWhite = white;
        let trueBlack = black;

        setBlack(trueWhite);
        setWhite(trueBlack);
    }

    let handleStart = async () => {
        let rawData = await fetch(`/api/comp-game/start`, {
            method: "post",
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            }
        });

        let data = await rawData.json();

        if (data.status !== "ok") {
            message.error(data.msg);
        }
    }

    let handleExit = async () => {
        navigate('/');
    }

    return (
        <div>
            <div style={{float: "left", width: "40%", height: "80%"}}>
                <White username={white?.username}
                        isCreator={white?.isCreator}
                />
            </div>
            <div style={{float: "left", width: "20%", height: "80%", textAlign: "center", paddingTop: "10px"}}>
                <div style={{width: "80%", marginLeft: "auto", marginRight: "auto"}}>
                <div className='game-btn' style={{width: "100%", height: "5vw", paddingTop: "27px", marginTop: "1vw", backgroundColor: "#036bfc"}} onClick={handleStart}><a>Start</a></div>
                    <div className='game-btn' style={{width: "100%", height: "5vw", paddingTop: "27px", marginTop: "1vw"}} onClick={handleSwitchSide}><a>Switch side</a></div>
                    <div className='game-btn' style={{width: "100%", height: "60px", paddingTop: "27px", marginTop: "1vw", backgroundColor: "#bf2c3b"}} onClick={handleExit}><a>Exit lobby</a></div>
                </div>
            </div>
            <div style={{float: "right", width: "40%", height: "80%"}}>
                <Black username={black?.username}
                        isCreator={black?.isCreator}
                />
            </div>
        </div>
    )
}

function White({ username, isCreator }) {
    return (
        <div style={{width: "100%", height: "100%", backgroundColor: "#1E1D2F", textAlign: "center", paddingTop: "10px", display: "flex", flexDirection: 'column', alignItems: "center"}}>
            <div style={{minHeight:"150px"}}>
            <h1>White</h1>
            <div style={{ color:"white",fontSize: "1.6vw" }}>
                {isCreator ?
                <CrownOutlined /> :
                <br></br>}
            </div>
            <div style={{ display: "block", textAlign: "center" }}>
                {username ? <h2>{username}</h2> : <></>}
            </div>
            </div>
                <img src="../../public/chess1.png" alt="" style={{display: "flex", position:"relative", width: "20vw", height: "20vw", bottom: "-1.7vw" }}/> 
        </div>
    )
}

function Black({ username, isCreator }) {
    return (
        <div style={{width: "100%", height: "100%", backgroundColor: "#1E1D2F", textAlign: "center", paddingTop: "10px", display: "flex", flexDirection: 'column', alignItems: "center"}}>
            <div style={{minHeight:"150px"}}>
            <h1>Black</h1>
            
            <div style={{ color:"white",fontSize: "1.6vw" }}>
                {isCreator ?
                <CrownOutlined /> :
                <br></br>}
            </div>
            <div style={{ display: "block", textAlign: "center" }}>
                {username ? <h2>{username}</h2> : <></>}
            </div>
            </div>
                <img src="../../public/chess2.png" alt="" style={{display: "flex", position:"relative", width: "20vw", height: "20vw", bottom: "-1.7vw"}}/> 
        </div>
    )
}

export default function CompLobby() {
    let navigate = useNavigate();

    let { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        message.error("Cannot join lobby if not logged in");
        navigate('/');
    }

    useEffect(() => {
        socket.on("game started", (gameid) => {
            navigate(`/game/${gameid}`);
        });

        return () => {
            socket.off("game started");
        }
    }, []);

    return (
        <div>
            <div id="leftbar" style={{float:"left"}}>
                <VerticalmenuUser />
            </div>
            <div className = {view.content}>
              <div style={{padding: "25px 200px"}}>
                  <Info />
              </div>
            </div>
        </div>

    )
}