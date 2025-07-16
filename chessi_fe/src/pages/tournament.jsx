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

function TournamentDisplay() {
    let navigate = useNavigate();
    let { profile, accessToken } = useContext(AuthContext);
    const params = useParams() // Get the 'id' from the URL parameters
    let { players, setPlayers, setTournamentName, setTournamentStatus, setIsInTournament } = useContext(TournamentContentContext);

    // player info
    let [isOrganizer, setIsOrganizer] = useState(false);
    let [viewPlayer, setViewPlayer] = useState(null);
    let [playerGames, setPlayerGames] = useState(null);
    let [playerActiveGame, setPlayerActiveGame] = useState(null);

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

    const removePlayer = (playerid) => {
        setPlayers(players.filter((p) => p.id !== playerid))
    }

    const handleViewGameHistory = async (playerid) => {        
        let rawData = await fetch(`/api/tournament/${params.tournamentid}/user/${playerid}/games`, {
            method: 'get'
        });     

        let data = await rawData.json();

        if (data.status === "ok") {
            setViewPlayer(players.find(p => p.userid === playerid));
            setPlayerGames(data.games);
            setPlayerActiveGame(data.activeGame);
        } else {
            message.error(data.msg);
        }
    }

    return (
        <div className="min-h-screen bg-slate-800 p-6 flex justify-center gap-[100px]" style={{ backgroundColor: "#1E293B" }}>
            <div className="w-[900px] space-y-6">
                <TournamentHeader isOrganizer={isOrganizer} />

                <div
                    className="bg-slate-700 border border-slate-600 rounded-lg"
                    style={{ backgroundColor: "#334155", borderColor: "#475569" }}
                >
                    <div className="p-6">
                        <div className="space-y-3">
                            {players.map((player, index) => (
                                <div
                                    className="flex items-center justify-between p-3 bg-slate-600 rounded-lg"
                                    style={{ backgroundColor: "#475569" }}
                                >
                                    <div className="flex flex-1 items-center gap-3">
                                        <div
                                            className="w-8 h-8 bg-slate-500 rounded-full flex items-center justify-center text-white font-semibold"
                                            style={{ backgroundColor: "#64748B", color: "white" }}
                                        >
                                            {index + 1}
                                        </div>
                                        <div className="flex justify-between items-center text-white w-full">
                                            <div className="flex items-baseline gap-2 overflow-hidden cursor-pointer" onClick={() => handleViewGameHistory(player.userid)}>
                                                <span className="text-sm">{player.rank}</span>
                                                <span className="font-medium truncate">{player.username}</span>
                                                <span className="text-xs italic text-slate-400">{player.rating}</span>
                                            </div>

                                            <div className="flex items-center gap-4 ml-auto">
                                                {/* Game History */}
                                                <div className="flex gap-1 text-sm">
                                                    {player.gameResults.map((result, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={
                                                                result === 'w'
                                                                    ? "text-green-500"
                                                                    : result === 'l'
                                                                        ? "text-red-500"
                                                                        : "text-slate-400"
                                                            }
                                                        >
                                                            {result.toUpperCase()}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Total Score */}
                                                <span className="text-white font-semibold text-sm">
                                                    {player.points}
                                                </span>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            ))}
                            {players.length === 0 && (
                                <p className="text-slate-400 text-center py-8" style={{ color: "#94A3B8" }}>
                                    No players in this tournament.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
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
