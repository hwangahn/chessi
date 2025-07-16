import { useEffect, useState } from "react";
import { message } from "antd";

export default function UseGetGame({ accessToken }) { // get user's active game
    let [gameid, setGameid] = useState(null);

    useEffect(() => {
        (async function () {
            if (accessToken) {
                let rawData = await fetch('/api/game/user-active-game', {
                    method: 'get',
                    headers: {
                        'authorization': 'Bearer ' + accessToken,
                    }
                });

                let data = await rawData.json();

                if (data.status === "error") {
                    message.warning(data.msg);
                } else if (data.inGame) {
                    setGameid(data.gameid);
                }
            }
        })()
    }, []);

    return gameid;
}