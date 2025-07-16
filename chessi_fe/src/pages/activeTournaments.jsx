import view from './view.module.css';
import { useEffect, useState } from "react"
import { message } from "antd";
import VerticalmenuUser from "../components/verticalmenuUser";
import TournamentList from "../components/tournament/list";

export default function ActiveTournament() {
    let [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/tournaments/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            let data = await rawData.json();

            if (data.status == "ok") {
                setTournaments(data.tournaments);
            } else {
                message.error(data.message);
            }
        })()
    }, []);


    return (
        <div>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1 style={{ textShadow: "0 0 1.3 #396FAE" }}>Active tournaments</h1>
                </div>
                <div className="ml-[14.2%] flex flex-col align-center p-7">
                    <div className="w-[80%]" style={{ backgroundColor: "#334155", borderRadius: "8px", overflow: "hidden" }}>
                        <TournamentList tournaments={tournaments} />
                    </div>
                </div>
            </div>
        </div>
    )
}
