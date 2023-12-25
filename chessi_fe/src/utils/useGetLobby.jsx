import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default async function UseGetLobby({accessToken}) { // get user's active lobyb
    let navigate = useNavigate();

    useEffect(() => {
        (async function() {
            if (accessToken) {
                let rawData = await fetch('/api/lobby/user-active-lobby', {
                    method: 'get',
                    headers: {
                        'authorization': 'Bearer ' + accessToken,
                    }
                });
        
                let { status, inLobby, lobbyid } = await rawData.json();
                
                if (status === "error") {
                    message.warning(msg);
                } else if (inLobby) {
                    navigate(`/lobby/${lobbyid}`);
                }
            }
        })()
    }, []);
}