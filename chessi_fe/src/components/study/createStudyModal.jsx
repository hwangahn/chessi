import { useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Modal, Input, message, Button } from "antd"
import { AuthContext } from "../../contexts/auth";

export default function CreateStudyModal({ chapters, setChapters }) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("");
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);

    let { accessToken } = useContext(AuthContext);

    const boardEditorRef = useRef();
    const navigate = useNavigate();

    const handleCancel = () => {
        setIsOpen(false);
        setName("");
        setEmoji("");
        setColor("");
    }

    const handleCreateChapter = async () => {
        let rawData = await fetch(`/api/study/create`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: name, 
                emoji: emoji,
                color: color 
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Study created successfully");
            navigate(`/study/${data.studyid}/edit`);
        } else {
            message.error(data.msg);
        }

        boardEditorRef.current.resetPosition();
        setChapters([...chapters, { name: chapterName, position: boardEditorRef.current.getPosition() }]);
        setLoading(false);
        setChapterName("");
        setIsOpen(false);
    }

    return (
        <>
            <div className="border-t border-gray-700 p-4">
                <Button className="bg-slate-800 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setIsOpen(true)}>
                    Create study
                </Button>
            </div>
            <Modal
                title="Create Study"
                open={isOpen}
                confirmLoading={loading}
                onOk={handleCreateChapter}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
                className="modal"
            >
                <div className="flex flex-col gap-3 pb-4">
                    <Text className="text-xl text-white" strong>Study name</Text>
                    <div className="flex gap-2">
                        <EmojiSelector leftAlign />
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter study name"
                            className="text-xl font-thick bg-[#1f1f1f] text-white border border-gray-600 p-2"
                        />
                        <ColorSelector />
                    </div>
                </div>
            </Modal>
        </>
    )
}