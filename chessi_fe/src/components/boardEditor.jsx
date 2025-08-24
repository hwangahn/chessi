import { useState, useRef, useImperativeHandle, forwardRef } from "react"
import { Chessboard } from "react-chessboard"
import { Card, Grid, Typography } from "antd"
import { Chess } from 'chess.js'
import Settings from "./boardEditor/settings"
import FenDisplay from "./boardEditor/fenDisplay"
import PiecePalette from "./boardEditor/piecePallete"

const { Title } = Typography

const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const CLEARED_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

const BoardEditor = forwardRef((props, ref) => {
  const [position, setPosition] = useState(STARTING_POSITION)
  const [orientation, setOrientation] = useState('white');
  const [selectedPiece, setSelectedPiece] = useState(null);

  const gameRef = useRef(new Chess(position, { skipValidation: true }));
  const game = gameRef.current;

  // used to store what user drawed on board
  const [circles, setCircles] = useState([]); // inittiate circles. if nothing is passed, set as empty array

  // for parents to control
  useImperativeHandle(ref, () => ({
    getPosition: () => position,
    setPosition: (newPosition) => {
      game.load(newPosition, { skipValidation: true });
      setPosition(game.fen());
    },
    resetPosition: () => {
      game.reset();
      setPosition(STARTING_POSITION)
    }
  }));

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

    return (
      <div ref={ref} style={{ ...style, position: "relative" }}>
        {children}

        {circles.find(circle => circle === square) && // render circles
          <div style={circleStyle}></div>
        }
      </div>
    );
  })

  const onSquareClick = (square) => {
    if (selectedPiece) { // if a piece is selected
      game.put({
        color: selectedPiece[0],
        type: selectedPiece[1].toLowerCase()
      }, square);
    } else { // else, remove the piece occupying the square
      game.remove(square);
    }

    setCircles([]); // clear circles after placing a piece
    setPosition(game.fen());
  }

  const onPieceDrop = (sourceSquare, targetSquare, piece) => {
    const color = piece[0];
    const type = piece[1].toLowerCase();

    game.remove(sourceSquare);

    if (targetSquare) {
      // if the piece is dropped on a square, update its position
      game.put({
        color: color,
        type: type
      }, targetSquare);
    }

    // update the game state and return true if successful
    setCircles([]); // clear circles after placing a piece
    setPosition(game.fen());
  }

  const onSquareRightClick = (square) => {
    setCircles((prev) => {
      if (prev.find(circle => circle === square)) {
        return prev.filter(circle => circle !== square); // remove the circle if it already exists
      }

      return [...prev, square]; // add the new circle if it doesn't exist
    });
  };


  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Chessboard */}
      <div>
        <Card
          title={
            <Title level={4} style={{ margin: 0, color: "white" }}>
              Chess Position Editor
            </Title>
          }
          className="bg-slate-700 border-slate-600"
          style={{ backgroundColor: "#334155", borderColor: "#475569" }}
          bodyStyle={{ padding: "24px" }}
        >
          <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            <Chessboard
              allowDragOutsideBoard={true}
              animationDuration={0}
              position={position}
              boardOrientation={orientation}
              customSquare={CustomSquareRenderer}
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              onSquareRightClick={onSquareRightClick}
              customDarkSquareStyle={{ backgroundColor: "#6d7fd1" }}
            />
          </div>

          <Settings
            game={game}
            orientation={orientation}
            setOrientation={setOrientation}
            position={position}
            setPosition={setPosition}
          />
        </Card>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <PiecePalette selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} />
        <FenDisplay position={position} />
      </div>
    </div>
  )
});

export default BoardEditor