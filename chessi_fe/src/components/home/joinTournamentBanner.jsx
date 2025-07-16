import { TrophyOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";

export default function JoinTournamentBanner({ tournamentid }) { // get user's active tournament
    let navigate = useNavigate();
    
    return (
        <>
            {tournamentid && (
                <div className="flex flex-col items-center justify-center text-center p-6 text-white rounded-lg shadow-md max-w-md mx-auto h-fit">
                    <p className="text-lg font-medium mb-4">You are in a tournament</p>

                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold uppercase px-6 py-3 rounded shadow transition-all"
                        onClick={() => navigate(`/tournament/${tournamentid}`)}
                    >
                        <TrophyOutlined style={{
                            color: "#F59E0B",
                            fontSize: "24px",     // controls both width & height
                            lineHeight: "1",
                        }} />
                        Visit the tournament
                    </button >
                </div>

            )}
        </>
    )
}