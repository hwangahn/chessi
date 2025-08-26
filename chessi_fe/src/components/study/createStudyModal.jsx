import { useState, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { Modal, Input, message, Button, Typography } from "antd"
import { AuthContext } from "../../contexts/auth";
import EmojiSelector from "../inputs/emojiSelector";
import ColorSelector from "../inputs/colorSelector";

let { Text } = Typography;

export default function CreateStudyModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [emoji, setEmoji] = useState("♟️");
    const [color, setColor] = useState("#ffffff");
    const [loading, setLoading] = useState(false);

    let { accessToken } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleCancel = () => {
        setIsOpen(false);
        setName("");
        setEmoji("♟️");
        setColor("#ffffff");
    }

    const handleCreateStudy = async () => {
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
            setIsOpen(false);
            setName("");
            setEmoji("♟️");
            setColor("#ffffff");

            navigate(`/study/${data.studyid}/edit`);
        } else {
            message.error(data.msg);
        }
    }

    return (
        <>
            <div className="p-4 ml-auto w-fit">
                <Button className="bg-slate-800 w-fit justify-start text-gray-300 hover:text-white hover:bg-gray-800 m" onClick={() => setIsOpen(true)}>
                    Create study
                </Button>
            </div>
            <Modal
                title="Create Study"
                open={isOpen}
                confirmLoading={loading}
                onOk={handleCreateStudy}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
                className="modal"
            >
                <div className="flex flex-col gap-3 pb-4">
                    <div className="flex gap-2">
                        <EmojiSelector leftAlign emoji={emoji} onChange={setEmoji} />
                        <Input
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter study name"
                            className="text-xl font-thick bg-[#1f1f1f] text-white border border-gray-600 p-2"
                        />
                        <ColorSelector color={color} onChange={setColor} />
                    </div>
                </div>
            </Modal>
        </>
    )
}