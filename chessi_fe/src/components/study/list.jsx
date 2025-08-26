import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CreateChapterModal from "./createChapterModal"
import { StudyContentContext } from "../../contexts/studyContext";
import { AuthContext } from "../../contexts/auth";

export default function StudyChapterMemberList({ chapterId, edit }) {
    let { study, chapters, setChapters, members } = useContext(StudyContentContext);
    let { accessToken } = useContext(AuthContext);

    const [_chapterId, setChapterId] = useState(chapterId);
    const [activeTab, setActiveTab] = useState("chapters")
    const [draggedItem, setDraggedItem] = useState(null)
    const [dragOverItem, setDragOverItem] = useState(null)

    const navigate = useNavigate();

    useEffect(() => {
        setChapterId(chapterId);
    }, [chapterId])

    const handleClick = (toChapterId) => {
        navigate(`/study/${study.studyid}/chapter/${toChapterId}/${edit ? "edit" : ""}`);
    }

    const handleDragStart = (e, index) => {
        setDraggedItem(index)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", "chapter-list"); // required in some browsers
    }

    const handleDragOver = (e, index) => {
        e.preventDefault()
        setDragOverItem(index)
    }

    const handleDragLeave = () => {
        setDragOverItem(null)
    }

    const handleDrop = async (e, dropIndex) => {
        e.preventDefault()

        if (draggedItem === null) return

        const newChapters = [...chapters]
        const draggedChapter = newChapters[draggedItem]

        // Remove dragged item
        newChapters.splice(draggedItem, 1)

        // Insert at new position
        newChapters.splice(dropIndex, 0, draggedChapter)

        setChapters(newChapters)
        setDraggedItem(null)
        setDragOverItem(null)

        // update position in server
        await fetch(`/api/study/${study.studyid}/chapter/sort`, {
            method: "post",
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chapters: newChapters
            })
        });
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
    }

    return (
        <div
            className="bg-slate-700 border-slate-600 w-[300px]"
            style={{ backgroundColor: "#334155", border: "1px solid #475569", color: "white", borderRadius: "0.5rem", overflow: "hidden" }}
        >
            {/* Tab Headers */}
            <div className="flex border-b border-gray-700">
                <button
                    onClick={() => setActiveTab("chapters")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "chapters"
                        ? "text-orange-400"
                        : "text-gray-400 hover:text-white bg-gray-800"
                        }`}
                >
                    {chapters.length} Chapter{chapters.length !== 1 ? "s" : ""}
                </button>
                <button
                    onClick={() => setActiveTab("members")}
                    className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${activeTab === "members"
                        ? "text-orange-400"
                        : "text-gray-400 hover:text-white bg-gray-800"
                        }`}
                >
                    {members.length} Member{members.length !== 1 ? "s" : ""}
                </button>
            </div>

            {/* Content Area */}
            <div className="max-h-[500px] overflow-y-auto p-4">
                {activeTab === "chapters" && (
                    <div className="space-y-2">
                        {chapters.map((chapter, index) => (
                            <div
                                key={chapter.chapterid}
                                draggable={edit}
                                onClick={() => handleClick(chapter.chapterid)}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`flex items-center space-x-3 p-2 rounded transition-colors hover:cursor-pointer 
                                    ${draggedItem === index ? "opacity-50 bg-gray-700" : "hover:bg-gray-800"}
                                    ${dragOverItem === index && "bg-gray-700 border-t-2 border-orange-400"}
                                    ${_chapterId == chapter.chapterid && "bg-gray-800"}`}
                            >
                                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                </div>
                                <span className="text-blue-400 hover:text-blue-300 flex-1">{chapter.name}</span>
                            </div>
                        ))}

                        <div
                            key={chapters.length}
                            onDragOver={(e) => handleDragOver(e, chapters.length)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, chapters.length - 1)}
                            className={`flex items-center space-x-3 p-2 rounded transition-colors hover:cursor-pointer 
                                ${dragOverItem === chapters.length && "h-[40px] bg-gray-700 border-t-2 border-orange-400"}`}
                        ></div>
                    </div>
                )}

                {activeTab === "members" && (
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center space-x-3 p-2 rounded hover:bg-gray-800 transition-colors cursor-pointer"
                            >
                                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                                </div>
                                <span className="text-gray-300">{member.username}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {activeTab === "chapters" && <CreateChapterModal chapters={chapters} onSuccess={setChapters} />}

        </div>
    )
}
