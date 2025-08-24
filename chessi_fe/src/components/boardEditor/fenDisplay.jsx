import { Card, Typography } from "antd"

const { Title, Text } = Typography

export default function FenDisplay({ position }) {
  return (
    <Card
      title={
        <Title level={4} style={{ margin: 0, color: "white" }}>
          Position
        </Title>
      }
      className="bg-slate-700 border-slate-600"
      style={{ backgroundColor: "#334155", borderColor: "#475569" }}
      bodyStyle={{ padding: "24px" }}
    >
      <div
        style={{
          backgroundColor: "#f5f5f518",
          color: "white",
          padding: "12px",
          borderRadius: "6px",
          fontFamily: "monospace",
          fontSize: "12px",
          wordBreak: "break-all",
        }}
      >
        {position}
      </div>
      <Text type="secondary" style={{ fontSize: "12px", marginTop: "8px", display: "block", color: "white" }}>
        FEN (Forsyth-Edwards Notation) represents the current board position
      </Text>
    </Card>
  )
}