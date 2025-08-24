import { Button, Card, Typography } from "antd"
const { Title, Text } = Typography

const PIECE_TYPES = [
  { piece: "wK", name: "White King" },
  { piece: "wQ", name: "White Queen" },
  { piece: "wR", name: "White Rook" },
  { piece: "wB", name: "White Bishop" },
  { piece: "wN", name: "White Knight" },
  { piece: "wP", name: "White Pawn" },
  { piece: "bK", name: "Black King" },
  { piece: "bQ", name: "Black Queen" },
  { piece: "bR", name: "Black Rook" },
  { piece: "bB", name: "Black Bishop" },
  { piece: "bN", name: "Black Knight" },
  { piece: "bP", name: "Black Pawn" },
]

export default function PiecePalette({ selectedPiece, setSelectedPiece }) {
  const pieceStyle = {
    fontFamily: `"Noto Sans Symbols"`,
    fontSize: "40px",
    fontStyle: "normal",
    fontWeight: "normal",
    lineHeight: 1,
    display: "inline-block",
    textRendering: "optimizeLegibility",
  };

  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0, color: "white" }}>
          Piece Palette
        </Title>
      }
      className="bg-slate-700 border-slate-600"
      style={{ backgroundColor: "#334155", borderColor: "#475569" }}
      bodyStyle={{ padding: "24px" }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        {PIECE_TYPES.map(({ piece, name }) => (
          <Button
            key={piece}
            type={selectedPiece === piece ? "primary" : "default"}
            style={{ height: "48px", fontSize: "24px" }}
            onClick={() => setSelectedPiece(selectedPiece === piece ? null : piece)}
            className="bg-slate-800 justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <span className="chess-piece" style={pieceStyle}>
              {piece === "wK" && "♔"}
              {piece === "wQ" && "♕"}
              {piece === "wR" && "♖"}
              {piece === "wB" && "♗"}
              {piece === "wN" && "♘"}
              {piece === "wP" && "♙"}
              {piece === "bK" && "♚"}
              {piece === "bQ" && "♛"}
              {piece === "bR" && "♜"}
              {piece === "bB" && "♝"}
              {piece === "bN" && "♞"}
              {piece === "bP" && "♟"}
            </span>
          </Button>
        ))}
      </div>
    </Card>
  )
}