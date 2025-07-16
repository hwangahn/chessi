import { useEffect, useState } from "react";
import { message } from "antd";

export default function UseGetTournament({ accessToken }) { // get user's active tournament
    const [tournamentid, setTournamentid] = useState(null);

    useEffect(() => {
        (async function () {
            if (accessToken) {
                let rawData = await fetch('/api/tournament/user-active-tournament', {
                    method: 'get',
                    headers: {
                        'authorization': 'Bearer ' + accessToken,
                    }
                });

                let data = await rawData.json();

                if (data.status === "error") {
                    message.warning(data.msg);
                } else if (data.inTournament) {
                    setTournamentid(data.tournamentid);
                }
            }
        })()
    }, []);

    return tournamentid;
}