import { useNavigate } from "react-router-dom";

export default function JoinGameBanner({ gameid }) {
    let navigate = useNavigate();

    return (
        <>
            {gameid && (
                <div className="flex flex-col items-center justify-center text-center p-6 text-white rounded-lg shadow-md max-w-md mx-auto h-fit">
                    <p className="text-lg font-medium mb-4">You are in a game</p>

                    <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold uppercase px-6 py-3 rounded-full shadow transition duration-200"
                        onClick={() => navigate(`/game/${gameid}`)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M6 4l10 6-10 6V4z" />
                        </svg>
                        Resume the game
                    </button>
                </div>

            )}
        </>
    )
}