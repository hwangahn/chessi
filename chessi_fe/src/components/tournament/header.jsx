import { useState, useContext, useEffect } from "react"
import { Button, Card } from "antd"
import { TrophyOutlined, CheckCircleOutlined, CloseOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { useParams } from "react-router-dom" // Import useParams
import { AuthContext } from "../../contexts/auth";
import { TournamentContentContext } from "../../contexts/tournamentContent";
import socket from "../../utils/socket";
import { useNavigate } from "react-router-dom";

export default function TournamentHeader({ isOrganizer, ended }) {
    let navigate = useNavigate();
    let { accessToken, profile } = useContext(AuthContext);
    let { tournamentName, tournamentStatus, setTournamentStatus, isInTournament, setIsInTournament } = useContext(TournamentContentContext);
    const params = useParams() // Get the 'id' from the URL parameters
    const [matchmakingStatus, setMatchmakingStatus] = useState("idle")
    const [timeLeft, setTimeLeft] = useState("--:--");
    const [isEnded, setIsEnded] = useState(ended);

    useEffect(() => {
        socket.on("time left", (time) => {
            setTimeLeft(time);
        })

        socket.on("tournament ended", () => {
            setIsEnded(true);
        })

        return () => {
            socket.off("time left");
            socket.off("tournament ended");
        }
    }, []);

    const handleFindMatch = async () => {
        if (matchmakingStatus === "idle") {
            let rawData = await fetch(`/api/tournament/${params.tournamentid}/find-game`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            let data = await rawData.json();

            if (data.status === "ok") {
                setMatchmakingStatus("searching");
            } else {
                message.error(data.msg);
            }
        } else if (matchmakingStatus === "searching") {
            let rawData = await fetch(`/api/tournament/${params.tournamentid}/stop-find-game`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            let data = await rawData.json();

            if (data.status === "ok") {
                setMatchmakingStatus("idle");
            } else {
                message.error(data.msg);
            }
        }
    }

    const getMatchButtonContent = () => {
        switch (matchmakingStatus) {
            case "searching":
                return (
                    <>
                        <CloseOutlined className="w-4 h-4" />
                        Cancel Search
                    </>
                )
            default:
                return (
                    <>
                        <TrophyOutlined className="w-4 h-4" />
                        Find Match
                    </>
                )
        }
    }

    const handleStartTournament = async () => {
        let rawData = await fetch(`/api/tournament/${params.tournamentid}/start`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        let data = await rawData.json();

        if (data.status === "ok") {
            setTournamentStatus("started");
        } else {
            message.error(data.msg);
        }
    }

    const handleEndTournament = async () => {
        let rawData = await fetch(`/api/tournament/${params.tournamentid}/end`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        let data = await rawData.json();

        if (data.status === "ok") {
            setTournamentStatus("ended");
        } else {
            message.error(data.msg);
        }
    }

    const handleJoinTournament = async () => {
        let rawData = await fetch(`/api/tournament/${params.tournamentid}/join`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        let data = await rawData.json();

        if (data.status === "ok") {
            setIsInTournament(true);
        } else {
            message.error(data.msg);
        }
    }

    const handleLeaveTournament = async () => {
        let rawData = await fetch(`/api/tournament/${params.tournamentid}/leave`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })

        let data = await rawData.json();

        if (data.status === "ok") {
            navigate("/");
        } else {
            message.error(data.msg);
        }
    }

    return (
        <Card
            className="bg-slate-700 border-slate-600 h-fit"
            style={{ backgroundColor: "#334155", borderColor: "#475569", color: "white" }}
            bodyStyle={{ padding: "24px", height: "120px" }}
        >
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-2xl text-white flex items-center gap-2" style={{ color: "white" }}>
                        <TrophyOutlined style={{ color: "#F59E0B" }} />
                        {tournamentName}
                    </h2>
                </div>
                <div className="text-2xl flex items-center gap-2">
                    <ClockCircleOutlined />
                    <span className="text-2xl">{timeLeft}</span>
                </div>
            </div>

            {!isEnded && (
                <div className="flex items-center gap-2 justify-end">
                    {isOrganizer && tournamentStatus === "not started" && (
                        <Button
                            onClick={handleStartTournament}
                            style={{
                                backgroundColor: "#16A34A",
                                borderColor: "#16A34A",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            Start Tournament
                        </Button>
                    )}
                    {isOrganizer && (
                        <Button
                            onClick={handleEndTournament}
                            style={{
                                backgroundColor: "#DC2626",
                                borderColor: "#DC2626",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            End Tournament
                        </Button>
                    )}
                    {!isInTournament && (
                        <Button
                            onClick={handleJoinTournament}
                            style={{
                                backgroundColor: "#2563EB",
                                borderColor: "#2563EB",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            Join Tournament
                        </Button>
                    )}
                    {isInTournament && !isOrganizer && (
                        <Button
                            onClick={handleLeaveTournament}
                            style={{
                                backgroundColor: "#DC2626",
                                borderColor: "#DC2626",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            Leave Tournament
                        </Button>
                    )}
                    {tournamentStatus === "started" && isInTournament && (<Button
                        onClick={handleFindMatch}
                        disabled={matchmakingStatus === "found"}
                        style={{
                            backgroundColor: matchmakingStatus === "searching" ? "#DC2626" : matchmakingStatus === "found" ? "#16A34A" : "#2563EB",
                            borderColor: matchmakingStatus === "searching" ? "#DC2626" : matchmakingStatus === "found" ? "#16A34A" : "#2563EB",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                        className={`
                            ${matchmakingStatus === "searching" ? "hover:bg-red-700" : ""}
                            ${matchmakingStatus === "found" ? "hover:bg-green-700" : ""}
                            ${matchmakingStatus === "idle" ? "hover:bg-blue-700" : ""}
                        `}
                    >
                        {getMatchButtonContent()}
                    </Button>
                    )}
                </div>
            )}
        </Card>
    )
}
