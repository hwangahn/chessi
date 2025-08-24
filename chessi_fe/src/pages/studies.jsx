import { useEffect, useState } from 'react';
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import StudyGrid from '../components/study/grid';

export default function Studies() {
    const [studies, setStudies] = useState([
        {
            id: 1,
            name: "Be A Stockfish",
            avatar: "🤖",
            author: "BotBeater09",
            color: "border-l-[#008cffff]",
            timestamp: "2025-08-21T12:00:00Z"
        },
        {
            id: 2,
            name: "Beginner's Brilliancy",
            avatar: "🎯",
            author: "Phil224",
            color: "border-l-[#008cffff]",
            timestamp: "2025-08-21T12:00:00Z"
        },
        {
            id: 3,
            name: "Top 10 Mistakes: Part 3",
            avatar: "🐦",
            author: "Bosburp",
            color: "border-l-gray-400",
            timestamp: "2025-08-21T12:00:00Z"
        },
        {
            id: 4,
            name: "CRUSH the Ruy Lopez and Italian",
            avatar: "♟️",
            author: "FlamingHawk3000",
            color: "border-l-yellow-500",
            timestamp: "2025-08-21T12:00:00Z"
        },
        {
            id: 5,
            name: "10 MUST-KNOW Checkmate Patterns",
            avatar: "🐧",
            author: "TheUltimateTheorist",
            color: "border-l-blue-400",
            timestamp: "2025-08-21T12:00:00Z"
        },
        {
            id: 6,
            name: "Hard Endgame Puzzles",
            avatar: "🧩",
            author: "dubEaR504",
            color: "border-l-purple-500",
            timestamp: "2025-08-21T12:00:00Z"
        },
    ]);

    useEffect(() => {
        // (async () => {
        //     let rawData = await fetch(`/api/studies/get`, {
        //         method: "GET",
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });

        //     let data = await rawData.json();

        //     if (data.status == "ok") {
        //         setStudies(data.studies);
        //     } else {
        //         message.error(data.message);
        //     }
        // })()
    }, []);

    return (
        <div>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1 style={{ textShadow: "0 0 1.3 #396FAE" }}>Studies</h1>
                </div>
                <div className="p-7">
                        <StudyGrid studies={studies} />
                </div>
            </div>
        </div>
    );
}