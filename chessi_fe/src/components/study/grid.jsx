import { Row, Col, Card, Empty } from "antd"
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import "../../css/studyGrid.css"
import AgoText from "../agoText"

const { Meta } = Card

export default function StudyGrid({ studies, edit }) {
    const navigate = useNavigate();

    const handleClick = (studyid) => {
        if (edit) {
            navigate(`/study/${studyid}/edit`);
        } else {
            navigate(`/study/${studyid}`);
        }
    };

    return (
        <div className="min-h-screen p-6">
            {studies?.length == 0 && <Empty description="No studies found" />}

            {studies?.length > 0 &&
                <Row gutter={[24, 24]} className="mx-auto">
                    {studies.map((study) => (
                        <Col xs={24} md={12} lg={8} key={study.studyid}>
                            <Card
                                className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200 border-l-4`}
                                style={{ borderLeftColor: study.color }}
                                bodyStyle={{ padding: "20px" }}
                            >
                                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => handleClick(study.studyid)}>
                                    <div className="text-2xl">{study.emoji}</div>
                                    <div className="flex-1">
                                        <h3 className="text-blue-400 text-lg font-semibold mb-1">{study.name}</h3>
                                    </div>
                                </div>

                                <div className="flex items-center text-gray-400 justify-between mt-4 pt-3 border-t border-gray-700">
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1">
                                            <UserOutlined />
                                            {study.author}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ClockCircleOutlined />
                                            <AgoText timestamp={study.timestamp} />
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            }
        </div>
    )
}