import { Link } from "react-router-dom";
import view from "../pages/view.module.css"

export default function SinglePost({ post, index }) {
    return (
        <li className={view.history_post} key={index}>
            <div className={view.post} style={{ marginBottom: "10px", textWrap: "wrap", overflowWrap: "break-word", wordBreak: "break-word" }}>
                <Link to="/">
                    <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                        <h1 style={{ textWrap: "wrap" }}>{post.post}</h1>
                        <br />
                        <h5>Author: {post.author}</h5>
                        <br />
                        <p style={{ textWrap: "wrap" }}>{post.timestamp}</p>
                    </div>
                </Link>
            </div>
        </li>
    )
}