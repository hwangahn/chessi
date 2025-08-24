import { Row, Col, Card, Empty } from "antd"
import { UserOutlined, ClockCircleOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import "../../css/studyGrid.css"
import AgoText from "../agoText"

const { Meta } = Card

export default function StudyGrid({ studies }) {
    const navigate = useNavigate();

    const handleClick = (studyId) => {
        navigate(`/study/${studyId}`);
    };

    return (
        <div className="min-h-screen p-6">
            {studies?.length == 0 && <Empty description="No studies found" />}

            {studies?.length > 0 &&
                <Row gutter={[24, 24]} className="mx-auto">
                    {studies.map((study) => (
                        <Col xs={24} md={12} lg={8} key={study.id}>
                            <Card
                                className={`bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors duration-200 border-l-4 ${study.accentColor}`}
                                bodyStyle={{ padding: "20px" }}
                            >
                                <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => handleClick(study.id)}>
                                    <div className="text-2xl">{study.avatar}</div>
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