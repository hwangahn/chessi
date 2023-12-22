import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export default async function UseGetGame({accessToken}) { // get user's active game
    let navigate = useNavigate();

    useEffect(() => {
        (async function() {
            if (accessToken) {
                let rawData = await fetch('/api/user-active-game', {
                    method: 'get',
                    headers: {
                        'authorization': 'Bearer ' + accessToken,
                    }
                });
        
                let { status, inGame, gameid } = await rawData.json();
                
                if (status === "error") {
                    message.warning(msg);
                } else if (inGame) {
                    navigate(`/game/${gameid}`);
                }
            }
        })()
    }, []);
}