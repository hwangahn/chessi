import { Button, Space, message, Select, Checkbox, Row, Col, Typography } from "antd"
import { BLACK, WHITE, KING, QUEEN } from 'chess.js'
const { Text } = Typography

const STARTING_POSITION = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
const CLEARED_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

export default function Settings({ game, orientation, setOrientation, position, setPosition }) {
  /**
   * Find en passant squares for the given position
   * @returns 
   */
  function findEnPassantSquares() {
    const epSquaresBlack = [];
    const epSquaresWhite = [];

    // the board is presented as an 8x8 array, with the 1st rank as the last element 
    // therefor the 
    const board = game.board();

    for (let rank = 3; rank <= 4; rank++) {
      for (let file = 0; file < 8; file++) {
        const piece = board[rank][file];
        if (!piece) continue;

        // Only pawns can participate
        if (piece.type !== "p") continue;

        const fileLetters = "abcdefgh";

        // Check white pawns for en passant captures
        if (piece.color === "w" && rank === 3) {
          // White pawn on rank 5 (index 4 in 0-based array)
          if (file > 0 && board[rank][file - 1]?.type === "p" && board[rank][file - 1]?.color === "b") {
            epSquaresWhite.push(fileLetters[file - 1] + "6"); // target square
          }
          if (file < 7 && board[rank][file + 1]?.type === "p" && board[rank][file + 1]?.color === "b") {
            epSquaresWhite.push(fileLetters[file + 1] + "6"); // target square
          }
        }

        // Check black pawns for en passant captures
        if (piece.color === "b" && rank === 4) {
          // Black pawn on rank 4
          if (file > 0 && board[rank][file - 1]?.type === "p" && board[rank][file - 1]?.color === "w") {
            epSquaresBlack.push(fileLetters[file - 1] + "3"); // target square
          }
          if (file < 7 && board[rank][file + 1]?.type === "p" && board[rank][file + 1]?.color === "w") {
            epSquaresBlack.push(fileLetters[file + 1] + "3"); // target square
          }
        }
      }
    }

    return {
      [WHITE]: [
        { value: "-", label: "None" },
        ...[...new Set(epSquaresWhite)].map((sq) => ({ value: sq, label: sq })),
      ],
      [BLACK]: [
        { value: "-", label: "None" },
        ...[...new Set(epSquaresBlack)].map((sq) => ({ value: sq, label: sq })),
      ]
    }
  }


  function setCastingRights(color, rights) {
    if (!game.setCastlingRights(color, rights)) {
      message.error("Cannot set castling rights");
    }

    setPosition(game.fen())
  }

  const clearBoard = () => {
    game.clear();
    setPosition(CLEARED_FEN)
  }

  const resetBoard = () => {
    game.reset();
    setPosition(STARTING_POSITION)
  }

  /**
  * Sets the en passant square on a Chess instance by loading a modified FEN.
  * @param {string|null} square - EP target like 'e3', or null to clear
  */
  function setEnPassantSquare(square) {
    // Get the current FEN
    const currentFen = game.fen();

    // Split into its 6 FEN components
    const parts = currentFen.split(" ");
    if (parts.length !== 6) {
      return false;
    }

    const [placement, activeColor, castling, ep, halfMoveClock, fullMoveNumber] = parts;

    // Build the new FEN with your EP square or '-' if null
    const newEp = square || "-";
    const newFen = [placement, activeColor, castling, newEp, halfMoveClock, fullMoveNumber].join(" ");

    // Load it into the chess game
    game.load(newFen, { skipValidation: true });

    // set position
    setPosition(game.fen());
  }

  /**
   * Get the current en passant square for a Chess instance.
   *
   */
  function getEnPassantSquare() {
    const parts = position.split(" ");
    // FEN format: [placement, activeColor, castling, enPassant, halfmoveClock, fullmoveNumber]
    const ep = parts[3];
    return ep === "-" ? null : ep;
  }

  return (
    <>
      <Space wrap style={{ marginTop: "16px", justifyContent: "center", width: "100%" }}>
        <Button className="bg-slate-800 justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={clearBoard}>Clear Board</Button>
        <Button className="bg-slate-800 justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={resetBoard}>Reset to Start</Button>
      </Space>

      <Space direction="vertical" style={{ marginTop: "16px", width: "100%" }} size="large">
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Text className="text-white" strong>Turn</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={game.turn()}
              onChange={(value) => {
                game.setTurn(value);
                setPosition(game.fen());
              }}
              options={[
                { value: WHITE, label: "White to play" },
                { value: BLACK, label: "Black to play" },
              ]}
            />
          </Col>

          <Col span={12}>
            <Text className="text-white" strong>Board orientation</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              value={orientation}
              onChange={(value) => { setOrientation(value) }}
              options={[
                { value: "white", label: "White" },
                { value: "black", label: "Black" },
              ]}
            />
          </Col>
        </Row>

        {/* Castling Rights */}
        <div>
          <Text className="text-white" strong>Castling Rights</Text>
          <div style={{ marginTop: 8 }}>
            <Row gutter={[16, 8]}>
              <Col span={12}>
                <Checkbox
                  className="text-white"
                  checked={game.getCastlingRights(WHITE)[KING]}
                  onChange={(e) => { setCastingRights(WHITE, { [KING]: e.target.checked }) }}
                >
                  White O-O
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  className="text-white"
                  checked={game.getCastlingRights(WHITE)[QUEEN]}
                  onChange={(e) => { setCastingRights(WHITE, { [QUEEN]: e.target.checked }) }}
                >
                  White O-O-O
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  className="text-white"
                  checked={game.getCastlingRights(BLACK)[KING]}
                  onChange={(e) => { setCastingRights(BLACK, { [KING]: e.target.checked }) }}
                >
                  Black O-O
                </Checkbox>
              </Col>
              <Col span={12}>
                <Checkbox
                  className="text-white"
                  checked={game.getCastlingRights(BLACK)[QUEEN]}
                  onChange={(e) => { setCastingRights(BLACK, { [QUEEN]: e.target.checked }) }}
                >
                  Black O-O-O
                </Checkbox>
              </Col>
            </Row>
          </div>
        </div>

        {/* En Passant */}
        <div>
          <Text className="text-white" strong>En Passant Target Square</Text>
          <Select
            style={{ width: "100%", marginTop: 8 }}
            value={getEnPassantSquare()}
            onChange={(value) => setEnPassantSquare(value)}
            options={findEnPassantSquares()[game.turn()]}
          />
        </div>
      </Space>

    </>
  )
}