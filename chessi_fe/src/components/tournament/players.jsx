import { useParams } from "react-router-dom" // Import useParams
import { message } from "antd";
import { useContext } from "react";
import { TournamentContentContext } from "../../contexts/tournamentContent";

export default function TournamentPlayers({ players }) {
    const params = useParams();

    let { setViewPlayer, setPlayerGames, setPlayerActiveGame } = useContext(TournamentContentContext);

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
    )
}