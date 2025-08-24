import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Button, Input, Typography, Space, message } from "antd";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import VerticalmenuUser from "../components/verticalmenuUser";
import StudyChapterMemberList from "../components/study/list";
import { AuthContext } from "../contexts/auth"
import socket from "../utils/socket";
import { StudyContent, StudyContentContext } from "../contexts/studyContext";
import EmojiSelector from "../components/selectors/emojiSelector";
import ColorSelector from "../components/selectors/colorSelector";

const { Text } = Typography;

function EditStudyContent() {
    let { accessToken } = useContext(AuthContext);

    let { study, setStudy, name, setName, description, setDescription, chapters, setChapters, members, setMembers } = useContext(StudyContentContext);

    const editor = useCreateBlockNote();
    const params = useParams() // Get the 'id' from the URL parameters

    editor.onContentChange = (editor) => {
        const json = editor.topLevelBlocks;
        console.log("Document JSON:", json);
    };

    useEffect(() => {
        let getStudyInfo = async () => {
            let rawData = await fetch(`/api/study/${params.studyid}`, {
                method: 'get',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setStudy(data.study);
                setName(data.study.name);
                setDescription(data.study.description);
                setChapters(data.chapters);
                setMembers(data.members);

                game.load(data.study.position, { skipValidation: true });
            } else {
                message.error(data.msg);
                navigate('/'); // return to main page
            }
        }

        socket.on("connect", async () => {
            // getChapterInfo();
        });

        return () => {
            socket.off("connect");
        }
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
                        <EmojiSelector leftAlign />
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter study name"
                            className="text-xl font-thick bg-[#1f1f1f] text-white border border-gray-600 p-2"
                        />
                        <ColorSelector />
                    </div>
                </div>
                <div className="flex flex-col gap-3 pb-4">
                    <Text className="text-xl text-white" strong>Study description</Text>
                    <BlockNoteView
                        editor={editor}
                        style={{
                            minHeight: "300px",
                            backgroundColor: "var(--bn-colors-editor-background)",
                            color: "white",
                            borderRadius: "8px",
                            padding: "12px",
                        }}
                    />
                </div>
                <ActionButtons study={study} name={name} description={description} setName={setName} setDescription={setDescription} />
            </div>
        </div>

    );
}

function ActionButtons({ study, name, description, setName, setDescription }) {
    const onSave = async () => {
        let rawData = await fetch(`/api/study/${study.id}/edit`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                description
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            setName(data.study.name);
            setDescription(data.study.description);
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