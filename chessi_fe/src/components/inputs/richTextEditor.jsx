import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useEffect } from "react";

export default function RichTextEditor({ viewOnly, styles, content, onChange }) {
    const editor = useCreateBlockNote();

    // Load content when it's available
    useEffect(() => {
        if (content && content.length > 0) {
            const current = JSON.stringify(editor.document);
            const incoming = JSON.stringify(content);
            if (current !== incoming) {
                editor.replaceBlocks(editor.document, content);
            }
        }
    }, [content]);

    // Helper: should we block this drag/drop?
    const shouldBlock = (dt) => {
        if (!dt) return false;

        // Types present on the drag payload
        const types = Array.from(dt.types || []);

        // Allow BlockNote/ProseMirror’s own internal drags
        const isInternalBlockDrag = types.includes("application/x-prosemirror-dragging");
        if (isInternalBlockDrag) return false;

        // Block anything else (e.g., your chapter list drags, text drags, etc.)
        return true;
    };

    return (
        <div
            onDragEnterCapture={(e) => {
                if (shouldBlock(e.dataTransfer)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            onDragOverCapture={(e) => {
                if (shouldBlock(e.dataTransfer)) {
                    e.preventDefault(); // critical to mark this drop as invalid
                    e.stopPropagation();
                }
            }}
            onDropCapture={(e) => {
                if (shouldBlock(e.dataTransfer)) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            <BlockNoteView
                editor={editor}
                editable={!viewOnly}
                style={{
                    backgroundColor: "var(--bn-colors-editor-background)",
                    color: "white",
                    borderRadius: "8px",
                    padding: "12px",
                    ...styles
                }}
                onChange={() => onChange?.(editor.document)}
            />
        </div>
    );
}