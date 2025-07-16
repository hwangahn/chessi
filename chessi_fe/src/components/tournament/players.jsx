import { Tag } from "antd";

export default function TournamentPlayers({ games }) {
    return (
        <div className="p-6">
            <div className="space-y-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="flex items-center justify-between p-4 bg-slate-600 rounded-lg"
                        style={{ backgroundColor: "#475569" }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-white font-medium" style={{ color: "white" }}>
                                    {game.player1}
                                </span>
                                <span className="text-slate-400" style={{ color: "#94A3B8" }}>
                                    vs
                                </span>
                                <span className="text-white font-medium" style={{ color: "white" }}>
                                    {game.player2}
                                </span>
                            </div>
                            {game.result && (
                                <p className="text-green-400 text-sm" style={{ color: "#4ADE80" }}>
                                    {game.result}
                                </p>
                            )}
                            {game.duration && (
                                <p className="text-slate-400 text-sm" style={{ color: "#94A3B8" }}>
                                    Duration: {game.duration}
                                </p>
                            )}
                        </div>
                        <Tag
                            color={game.status === "completed" ? "green" : "gold"}
                            style={{
                                backgroundColor: game.status === "completed" ? "#16A34A" : "#D97706",
                                borderColor: game.status === "completed" ? "#16A34A" : "#D97706",
                                color: "white",
                                padding: "4px 8px",
                                borderRadius: "9999px",
                            }}
                        >
                            {game.status === "completed" ? "Completed" : "Ongoing"}
                        </Tag>
                    </div>
                ))}
                {games.length === 0 && (
                    <p className="text-slate-400 text-center py-8" style={{ color: "#94A3B8" }}>
                        No games played yet. Start finding matches to begin!
                    </p>
                )}
            </div>
        </div> 
    )
}