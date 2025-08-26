import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, Typography, Space, message } from "antd";
import VerticalmenuUser from "../components/verticalmenuUser";
import StudyChapterMemberList from "../components/study/list";
import { AuthContext } from "../contexts/auth"
import { StudyContent, StudyContentContext } from "../contexts/studyContext";
import EmojiSelector from "../components/inputs/emojiSelector";
import ColorSelector from "../components/inputs/colorSelector";
import RichTextEditor from "../components/inputs/richTextEditor";

const { Text } = Typography;

function EditStudyContent() {
    let { accessToken } = useContext(AuthContext);

    let { study, setStudy, name, setName, description, setDescription, chapters, setChapters, members, setMembers } = useContext(StudyContentContext);

    const [emoji, setEmoji] = useState("♟️");
    const [color, setColor] = useState("#ffffff");

    const params = useParams() // Get the 'id' from the URL parameters

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
                setName(data.study.name);
                setColor(data.study.color);
                setEmoji(data.study.emoji);
                setDescription(data.study.description);
                setChapters(data.study.chapters);
                // setMembers(data.study.members);
            } else {
                message.error(data.msg);
                navigate('/'); // return to main page
            }
        })()
    }, []);

    return (
        <div className="min-h-screen p-6 flex gap-[50px] items-start">
            <div className="space-y-6">
                <StudyChapterMemberList edit />
            </div>
            <div className="w-[700px] height-fit flex flex-col gap-4 pb-4">
                <div className="flex flex-col gap-3 pb-4">
                    <Text className="text-xl text-white" strong>Study name</Text>
                    <div className="flex gap-2">
                        <EmojiSelector leftAlign emoji={emoji} onChange={setEmoji} />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter study name"
                            className="text-xl font-thick bg-[#1f1f1f] text-white border border-gray-600 p-2"
                        />
                        <ColorSelector color={color} onChange={setColor} />
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-4">
                    <Text className="text-xl text-white" strong>Study description</Text>
                    <RichTextEditor 
                        styles={{ minHeight: "300px" }} 
                        content={description} 
                        onChange={(content) => { setDescription(content) }}
                    />
                </div>
                <ActionButtons study={study} name={name} description={description} color={color} emoji={emoji} />
            </div>
        </div>

    );
}

function ActionButtons({ study, name, description, color, emoji }) {
    let { accessToken } = useContext(AuthContext);

    const onSave = async () => {
        let rawData = await fetch(`/api/study/${study.studyid}/edit`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description,
                color,
                emoji
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Study edited successfully");
        } else {
            message.error(data.msg);
            navigate('/'); // return to main page
        }
    };

    const onDelete = async () => {
        let rawData = await fetch(`/api/study/${study.id}/delete`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Study deleted successfully");
            navigate('/'); // return to main page
        } else {
            message.error(data.msg);
        }
    }

    return (
        <Space wrap style={{ justifyContent: "flex-end" }}>
            <Button type="primary" danger onClick={onDelete}>Delete study</Button>
            <Button type="primary" onClick={onSave}>Save study</Button>
        </Space>
    );
}

export default function EditStudy() {
    return (
        <StudyContent>
            <div id="leftbar">
                <VerticalmenuUser />
            </div>
            <div>
                <EditStudyContent />
            </div>
        </StudyContent>
    );
}