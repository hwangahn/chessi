import { useEffect, useContext, useState, useRef, forwardRef } from "react"
import { useParams, useNavigate } from "react-router-dom" // Import useParams
import { message, Modal } from "antd";
import { Chessboard } from "react-chessboard"
import VerticalmenuUser from "../components/verticalmenuUser";
import StudyChapterMemberList from "../components/study/list";
import { AuthContext } from "../contexts/auth"
import { GameContent, GameContentContext } from "../contexts/gameContent";
import { StudyContent, StudyContentContext } from "../contexts/studyContext";

function Board({ game, circles, setCircles, arrows, position, setPosition, side }) {
    const [drawMode, setDrawMode] = useState(true); // draw mode: for drawing arrows and circles
    const [moveFrom, setMoveFrom] = useState('');
    const [optionSquares, setOptionSquares] = useState({});

    const CustomSquareRenderer = forwardRef((props, ref) => {
        const { children, square, squareColor, style } = props;

        let circleStyle = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: `radial-gradient(circle, transparent 60%, rgb(255,170,0) 60%, rgb(255,170,0) 70%, transparent 70%)`
        }

        let moveNormalSquareStyle = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: `radial-gradient(circle, rgb(0,0,0,0.3) 0%, rgb(0,0,0,0.3) 25%, transparent 25%)`
        }

        let moveCaptureSquareStyle = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: `radial-gradient(circle, transparent 80%, rgba(0,0,0,.3) 5%)`
        }

        let moveSourceSquareStyle = {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            background: 'rgba(255, 255, 0, 0.4)'
        }

        return (
            <div ref={ref} style={{ ...style, position: "relative" }}>
                {children}

                {circles.find(circle => circle === square) && // render circles
                    <div style={circleStyle}></div>
                }

                {Object.keys(optionSquares).find(_square => _square === square && optionSquares[_square].type === 'normalSquare') && // render normal move
                    <div style={moveNormalSquareStyle}></div>
                }

                {Object.keys(optionSquares).find(_square => _square === square && optionSquares[_square].type === 'captureSquare') && // render capture move
                    <div style={moveCaptureSquareStyle}></div>
                }

                {Object.keys(optionSquares).find(_square => _square === square && optionSquares[_square].type === 'sourceSquare') && // render capture move
                    <div style={moveSourceSquareStyle}></div>
                }
            </div>
        );
    });

    const onSquareRightClick = (square) => {
        if (!drawMode) {
            return;
        }

        setCircles((prev) => {
            if (prev.find(circle => circle === square)) {
                return prev.filter(circle => circle !== square); // remove the circle if it already exists
            }

            return [...prev, square]; // add the new circle if it doesn't exist
        });
    };

    const onArrowsChange = (newArrows) => {
        if (!drawMode) {
            return;
        }

        arrows = newArrows; // no re-renders, but keep data in stage
    };

    const onPieceDrop = (sourceSquare, targetSquare, piece) => {
        if (drawMode) {
            return;
        }

        try {
            game.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: piece[1].toLowerCase() // promotion dialog returns the piece as the promoted piece, not the pawn
            });

            // update the game state and return true if successful
            setPosition(game.fen());
            setMoveFrom(''); // clear moveFrom
            setOptionSquares({}); // clear option squares
        } catch (error) { }
    }

    // get the move options for a square to show valid moves
    function getMoveOptions(square) {
        // get the moves for the square
        const moves = game.moves({
            square,
            verbose: true
        });

        // if no moves, clear the option squares
        if (moves.length === 0) {
            setOptionSquares({});
            return false;
        }

        // create a new object to store the option squares
        const newSquares = {};

        // loop through the moves and set the option squares
        for (const move of moves) {
            let capturing = game.get(move.to) && (game.get(move.to)?.color !== game.get(square)?.color); // indicates there is an opponent piece at the square for capturing
            newSquares[move.to] = { type: capturing ? 'captureSquare' : 'normalSquare' }; // set the square type based on whether it is a capture or not
        }

        // set the square clicked to move from to yellow
        newSquares[square] = { type: 'sourceSquare' };

        // set the option squares
        setOptionSquares(newSquares);

        // return true to indicate that there are move options
        return true;
    }

    const onSquareClick = function (square, piece) {
        if (drawMode) {
            return;
        }

        // piece clicked to move
        if (!moveFrom && piece) {
            // get the move options for the square
            const hasMoveOptions = getMoveOptions(square);

            // if move options, set the moveFrom to the square
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }

        // try moving
        try {
            game.move({
                from: moveFrom,
                to: square,
                promotion: 'q'
            });

            // update the game state and return true if successful
            setPosition(game.fen());
            setMoveFrom(''); // clear moveFrom
            setOptionSquares({}); // clear option squares
        } catch {
            // if invalid, setMoveFrom and getMoveOptions
            const hasMoveOptions = getMoveOptions(square);

            // if new piece, setMoveFrom, otherwise clear moveFrom
            if (hasMoveOptions) {
                setMoveFrom(square);
            }

            // return early
            return;
        }
    }

    return (
        <div className="w-[100%] relative">
            <Chessboard
                areArrowsAllowed={drawMode}
                position={position}
                customArrows={arrows}
                customSquare={CustomSquareRenderer}
                boardOrientation={side}
                onSquareRightClick={onSquareRightClick}
                onArrowsChange={onArrowsChange}
                onPieceDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                customDarkSquareStyle={{ backgroundColor: "#6d7fd1" }}
            />
        </div>
    )
}

function ChapterDisplay() {
    let { accessToken } = useContext(AuthContext);
    let { game, side, setSide, position, setPosition, onMove, setOnMove, history, setHistory } = useContext(GameContentContext);
    let { study, setStudy, chapters, setChapters, members, setMembers } = useContext(StudyContentContext);

    const navigate = useNavigate();
    const params = useParams() // Get the 'id' from the URL parameters

    // data of current chapter
    const [chapterId, setChapterId] = useState();
    const [chapter, setChapter] = useState(null);
    // used to store what user drawed on board
    const [circles, setCircles] = useState([]); // inittiate circles. if nothing is passed, set as empty array
    const [arrows] = useState([]); // inittiate arrows. if nothing is passed, set as empty array

    // getting study info based on study param change
    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/study/${params.studyid}/get`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setStudy(data.study);
                setChapters(data.study.chapters);
                // setMembers(data.members);
            } else {
                message.error(data.msg);
                navigate('/'); // return to main page
            }
        })();
    }, [params.studyid]);

    // getting chapter info based on chapterId param change
    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/study/${params.studyid}/chapter/${params.chapterid}/get`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setChapter(data.chapter);
                setChapterId(data.chapter.chapterid);
                setSide(data.chapter.side);
                setPosition(data.chapter.fen);

                game.load(data.chapter.fen, { skipValidation: true });
            } else {
                message.error(data.msg);
                navigate(`study/${params.studyid}`); // return to main study
            }
        })();
    }, [params.chapterid]);

    return (
        <>
            <div className="min-h-screen p-6 flex gap-[50px]">
                <div className="space-y-6">
                    <StudyChapterMemberList edit chapterId={chapterId} />
                </div>
                <div className="w-[700px] space-y-6">
                    <Board
                        game={game}
                        circles={circles}
                        setCircles={setCircles}
                        arrows={arrows}
                        position={position}
                        setPosition={setPosition}
                        side={side}
                    />
                </div>
            </div>
        </>
    )
}

export default function EditStudyChapter() {
    return (
        <StudyContent>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div>
                <GameContent>
                    <ChapterDisplay />
                </GameContent>
            </div>
        </StudyContent>
    )
}
