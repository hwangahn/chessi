import { List } from "antd"
import { useNavigate } from "react-router-dom";

function parseTime(isoTimestamp) {
    const date = new Date(isoTimestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

export default function TournamentList({ tournaments, past }) {
    const navigate = useNavigate();

    let handleOpenTournament = (tournamentid) => {
        if (past) {
            navigate(`/tournament/past/${tournamentid}`);
        } else {
            navigate(`/tournament/${tournamentid}`);
        }
    }

    let getSubtitle = (item) => {
        if (past) {
            return `Ended at ${parseTime(item.timestamp)}`;
        } else {
            if (item.status == "not started" || !item.startTime) {
                return `Not started`;
            } else {
                return `Started at ${parseTime(item.startTime)}`; 
            }
        }
    }

    return (
        <div className="bg-[#334155] h-fit p-4">
            <List
                className="bg-[#334155]"
                dataSource={tournaments}
                renderItem={(item) => (
                    <List.Item 
                        className="border-0 border-b border-gray-700 last:border-b-0 hover:bg-gray-800 transition-colors cursor-pointer" 
                        onClick={() => handleOpenTournament(item.tournamentid)}
                        style={{ borderRadius: "8px", paddingLeft: "10px" }}
                    >
                        <div className="flex justify-between items-center w-full">
                            <div className="flex-1">
                                <div className="text-gray-200 text-base font-medium mb-1">{item.name}</div>
                                <div className="text-gray-400 text-sm">
                                    {getSubtitle(item)}
                                </div>
                            </div>
                            <div className="flex items-center space-x-8 text-gray-300">
                                <div className="text-center min-w-[2rem]">
                                    <span className="text-sm font-medium">{item.points}</span>
                                </div>
                                <div className="text-center min-w-[2rem]">
                                    <span className="text-sm font-medium">{item.rank}</span>
                                </div>
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </div>
    )
}
