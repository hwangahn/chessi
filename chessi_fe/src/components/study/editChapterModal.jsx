import { useState, useContext } from "react"
import { Modal, Input, message, Button } from "antd"
import { AuthContext } from "../../contexts/auth";
import { useParams } from "react-router-dom" // Import useParams

export default function CreateChapterModal({ chapter, setChapters }) {
    const [isOpen, setIsOpen] = useState(false);
    const [chapterName, setChapterName] = useState(chapter?.name || "");
    const [loading, setLoading] = useState(false);

    let { accessToken } = useContext(AuthContext);

    const params = useParams() // Get the 'id' from the URL parameters

    const handleCreateChapter = async () => {
        let rawData = await fetch(`/api/study/${params.studyid}/chapter/${chapter.id}/edit`, {
            method: 'post',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: chapterName })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Chapter created successfully");
            setChapterName("");
            setChapters((prev) => {
                return 
            });
        } else {
            message.error(data.msg);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="border-t border-gray-700 p-4">
                <Button className="bg-slate-800 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800" onClick={() => setIsOpen(true)}>
                    Edit chapter
                </Button>
            </div>
            <Modal
                title="Create Chapter"
                open={isOpen}
                confirmLoading={loading}
                onOk={handleCreateChapter}
                onCancel={() => setIsOpen(false)}
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
            </Modal>
        </>
    )
}