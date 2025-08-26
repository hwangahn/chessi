import { useState, useContext, useRef } from "react"
import { Modal, Input, message, Button } from "antd"
import { AuthContext } from "../../contexts/auth";
import { useParams } from "react-router-dom" // Import useParams
import BoardEditor from "../boardEditor";

export default function CreateChapterModal({ chapters, onSuccess }) {
    const [isOpen, setIsOpen] = useState(false);
    const [chapterName, setChapterName] = useState("");
    const [loading, setLoading] = useState(false);

    let { accessToken } = useContext(AuthContext);

    const boardEditorRef = useRef();

    const params = useParams() // Get the 'id' from the URL parameters

    const handleCancel = () => {
        boardEditorRef.current.resetPosition();
        setIsOpen(false);
        setChapterName("");
    }

    const handleCreateChapter = async () => {
        let rawData = await fetch(`/api/study/${params.studyid}/chapter/create`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                name: chapterName,
                fen: boardEditorRef.current.getPosition()
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Chapter created successfully");
            boardEditorRef.current.resetPosition();
            setLoading(false);
            setChapterName("");
            setIsOpen(false);
            onSuccess([...chapters, data.chapter]);
        } else {
            message.error(data.msg);
        }
    }

    return (
        <>
            <div className="border-t border-gray-700 p-4">
                <Button className="bg-slate-800 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setIsOpen(true)}>
                    Add a new chapter
                </Button>
            </div>
            <Modal
                title="Create Chapter"
                open={isOpen}
                confirmLoading={loading}
                onOk={handleCreateChapter}
                onCancel={handleCancel}
                okText="Confirm"
                cancelText="Cancel"
                className="modal"
            >
                <Input
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    placeholder="Enter chapter name"
                    className="mb-[24px]"
                />
                <BoardEditor ref={boardEditorRef} />
            </Modal>
        </>
    )
}