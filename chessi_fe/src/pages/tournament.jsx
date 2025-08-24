import { useEffect, useContext, useState } from "react"
import TournamentHeader from "../components/tournament/header"
import { useParams } from "react-router-dom" // Import useParams
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import socket from "../utils/socket";
import { TournamentContent, TournamentContentContext } from "../contexts/tournamentContent";
import VerticalmenuUser from "../components/verticalmenuUser";
import { AuthContext } from "../contexts/auth"
import TournamentPlayerGames from "../components/tournament/games";
import TournamentPlayers from "../components/tournament/players";

function TournamentDisplay() {
    let navigate = useNavigate();
    let { profile, accessToken } = useContext(AuthContext);
    const params = useParams() // Get the 'id' from the URL parameters
    let { players, setPlayers, setTournamentName, setTournamentStatus, setIsInTournament, viewPlayer, playerGames, playerActiveGame } = useContext(TournamentContentContext);

    // player info
    let [isOrganizer, setIsOrganizer] = useState(false);

    useEffect(() => {
        let joinRoom = () => {
            socket.emit("join room", params.tournamentid);
        }

        let getTournamentInfo = async () => {
            let rawData = await fetch(`/api/tournament/${params.tournamentid}`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setIsOrganizer(data.tournament.organizerid == profile.userid);
                setPlayers(data.tournament.players);
                setTournamentName(data.tournament.name);
                setTournamentStatus(data.tournament.status);
                setIsInTournament(data.isUserInTournament);
            } else {
                message.error(data.msg);
                navigate('/'); // return to main page
            }
        }

        socket.on("connect", async () => {
            joinRoom();
            getTournamentInfo();
        });

        socket.on("started", () => {
            setTournamentStatus("started");
            message.success("Tournament started");
        })

        socket.on("ended", () => {
            setTournamentStatus("ended");
            message.warning("Tournament ended");
        })

        socket.on("player joined", (player) => {
            setPlayers(prev => {
                return [...prev, player].sort((a, b) => b.points - a.points);
            });
        })

        socket.on("player left", (userid) => {
            console.log(players, userid);
            setPlayers(prev => {
                return prev.filter((p) => p.userid !== userid);
            });
        });

        socket.on("game found", (gameid) => {
            navigate(`/game/${gameid}`);
        });

        if (socket.connected) {
            joinRoom();
            getTournamentInfo();
        } else {
            message.warning("Cannot connect to server");
        }

        return () => {
            socket.off("time left");
            socket.off("connect");
            socket.off("game over");
            socket.off("player leave");
            socket.off("game found");
        }
    }, [])

    return (
        <div className="min-h-screen p-6 flex justify-center gap-[100px]">
            <div className="w-[900px] space-y-6">
                <TournamentHeader isOrganizer={isOrganizer} />

                <TournamentPlayers players={players} />
            </div>
            <TournamentPlayerGames player={viewPlayer} games={playerGames} activeGame={playerActiveGame} />
        </div>
    )
}


export default function Tournament() {
    return (
        <TournamentContent>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div>
                <TournamentDisplay />
            </div>
        </TournamentContent>
    )
}
