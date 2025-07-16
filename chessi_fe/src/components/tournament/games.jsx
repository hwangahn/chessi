import { Tag } from "antd";
import { useNavigate } from "react-router-dom";

export default function TournamentPlayerGames({ player, games, activeGame }) {
    const navigate = useNavigate();

    if (!player) {
        return;
    }

    return (
        <div
            className="flex flex-col gap-4 p-6 bg-slate-700 border border-slate-600 rounded-lg h-fit w-[300px]"
            style={{ backgroundColor: "#334155", borderColor: "#475569" }}
        >
            <div className="flex items-baseline gap-2 overflow-hidden justify-between cursor-pointer" >
                <div className="flex items-baseline gap-2">
                    <span className="font-medium truncate text-white">{player.username}</span>
                    <span className="text-xs italic text-slate-400">{player.rating}</span>
                </div>
                <span className="font-medium truncate text-white">{player.points}</span>
            </div>
            {activeGame && (
                <div className="space-y-3">
                    <div
                        key={activeGame.gameid}
                        className="flex items-center justify-between p-4 bg-slate-600 rounded-lg"
                        style={{ backgroundColor: "#475569" }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={() => navigate(`/game/${activeGame.gameid}`)}>
                                <div className="flex items-baseline gap-2 overflow-hidden">
                                    {activeGame.side == 'white' ?
                                        <div className="w-[10px] h-[10px] bg-white rounded-full border border-[#94A3B8]"></div>
                                        :
                                        <div className="w-[10px] h-[10px] bg-black rounded-full border border-[#94A3B8]"></div>
                                    }
                                    <span className="text-slate-400" style={{ color: "#94A3B8" }}>
                                        vs
                                    </span>
                                    <span className="text-white font-medium" style={{ color: "white" }}>
                                        {activeGame.opponent.username}
                                    </span>
                                </div>
                                <div className="w-[20px] h-[20px] bg-yellow-400 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="flex items-center justify-between p-4 bg-slate-600 rounded-lg"
                        style={{ backgroundColor: "#475569" }}
                    >
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between gap-2 cursor-pointer" onClick={() => navigate(`/game/played/${game.gameid}`)}>
                                <div className="flex items-baseline gap-2 overflow-hidden">
                                    {game.side == 'white' ?
                                        <div className="w-[10px] h-[10px] bg-white rounded-full border border-[#94A3B8]"></div>
                                        :
                                        <div className="w-[10px] h-[10px] bg-black rounded-full border border-[#94A3B8]"></div>
                                    }
                                    <span className="text-slate-400" style={{ color: "#94A3B8" }}>
                                        vs
                                    </span>
                                    <span className="text-white font-medium" style={{ color: "white" }}>
                                        {game.opponent.username}
                                    </span>
                                </div>
                                {game.result && (
                                    <span
                                        className={
                                            game.result === 'w'
                                                ? "text-green-500"
                                                : game.result === 'l'
                                                    ? "text-red-500"
                                                    : "text-slate-400"
                                        }
                                    >
                                        {game.result.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}