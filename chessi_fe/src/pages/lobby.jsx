import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/auth';
import VerticalmenuUser from './verticalmenuUser';
import { message } from 'antd';
import Chat from '../components/chat';
import socket from '../utils/socket';

function Info() {
    let { accessToken } = useContext(AuthContext);

    let [lobbyInfo, setLobbyInfo] = useState(null);
    let [timeLeft, setTimeLeft] = useState(300);

    let navigate = useNavigate();
    let params = useParams();

    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/lobby/${params.lobbyid}`, { // join lobby
                method: 'post',
                headers: {
                    'authorization': 'Bearer ' + accessToken,
                }
            });

            let data = await rawData.json();

            if (data.status === "error") {
                message.error(data.msg);
                navigate('/');
            } else {
                lobbyInfo = { creator: data.creator, guest: data.guest, white: data.white, black: data.black }
                setLobbyInfo({ ...lobbyInfo });
            }
        })();

        socket.emit("join room", (params.lobbyid));

        socket.on("lobby state", (creator, guest, white, black, timeLeft) => {
            lobbyInfo = { creator, guest, white, black };
            setLobbyInfo({ ...lobbyInfo });
            setTimeLeft(timeLeft);
        });

        return () => {
            socket.off("lobby state");
        }
    }, []);

    let handleSwitchSide = async () => {
        let rawData = await fetch(`/api/lobby/${params.lobbyid}/switch-side`, {
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

    let handleStart = async () => {
        let rawData = await fetch(`/api/lobby/${params.lobbyid}/start`, {
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
        let rawData = await fetch(`/api/lobby/${params.lobbyid}/`, { // leave lobby
            method: "delete",
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            }
        });

        let data = await rawData.json();

        console.log(data);

        if (data.status === "ok") {
            navigate('/');
        } else {
            message.error(data.msg);
        }
    }

    return (
        <div>
            <div style={{float: "left", width: "40%", height: "80%"}}>
                <White username={lobbyInfo?.white?.username}
                        rating={lobbyInfo?.white?.rating}
                        isCreator={lobbyInfo?.white?.userid === lobbyInfo?.creator?.userid}
                />
            </div>
            <div style={{float: "left", width: "20%", height: "80%", textAlign: "center", paddingTop: "10px"}}>
                <h2 style={{color: "white"}}>{timeLeft}</h2>
                <div style={{width: "80%", marginLeft: "auto", marginRight: "auto"}}>
                    <div className='game-mode' style={{width: "100%", height: "100px", marginTop: "10px"}} onClick={handleSwitchSide}><a>Switch side</a></div>
                    <div className='game-mode' style={{width: "100%", height: "100px", marginTop: "10px"}} onClick={handleStart}><a>Start</a></div>
                    <div className='game-mode' style={{width: "100%", height: "100px", marginTop: "10px", backgroundColor: "#bf2c3b"}} onClick={handleExit}><a>Exit lobby</a></div>
                </div>
            </div>
            <div style={{float: "right", width: "40%", height: "80%"}}>
                <Black username={lobbyInfo?.black?.username}
                        rating={lobbyInfo?.black?.rating}
                        isCreator={lobbyInfo?.black?.userid === lobbyInfo?.creator?.userid}
                />
            </div>
        </div>
    )
}

function White({ username, rating, isCreator }) {
    return (
        <div style={{width: "100%", height: "500px", backgroundColor: "#1E1D2F", textAlign: "center", paddingTop: "10px"}}>
            <h1>White</h1>
            <div style={{ display: "block", width: "20%" }}>
                {isCreator ?
                <img src='lobby-creator-crown.png' /> :
                <></>}
            </div>
            <div style={{ display: "block", textAlign: "center" }}>
                {username ? <h2>{username}</h2> : <></>}
                {rating ? <h3>Rating: {rating}</h3> : <></> }
            </div>
        </div>
    )
}

function Black({ username, rating, isCreator }) {
    return (
        <div style={{width: "100%", height: "500px", backgroundColor: "#1E1D2F", textAlign: "center", paddingTop: "10px"}}>
            <h1>Black</h1>
            <div style={{ display: "block", width: "20%" }}>
                {isCreator ?
                <img src='lobby-creator-crown.png' /> :
                <></>}
            </div>
            <div style={{ display: "block", textAlign: "center" }}>
                {username ? <h2>{username}</h2> : <></>}
                {rating ? <h3>Rating: {rating}</h3> : <></> }
            </div>
        </div>
    )
}

export default function Lobby() {
    let navigate = useNavigate();
    let params = useParams();

    let { accessToken } = useContext(AuthContext);

    if (!accessToken) {
        message.error("Cannot join lobby if not logged in");
        navigate('/');
    }

    useEffect(() => {
        socket.on("game started", (gameid) => {
            navigate(`/game/${gameid}`);
        });

        socket.on("time out", () => {
            message.error("Lobby timed out");
            navigate('/');
        });

        return () => {
            socket.off("time out");
            socket.off("game started");
        }
    }, []);

    return (
        <div>
            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div style={{ float: "left", width: "20%", paddingLeft: "15px" }}>
                <Chat roomid={params.roomid} />
            </div>
            <div style={{ float: "right", width: "65%", height: "100%", paddingRight: "5%" }}>
                <Info />
            </div>
        </div>

    )
}