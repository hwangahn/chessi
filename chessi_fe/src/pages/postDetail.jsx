import { Input, message } from 'antd';
import { Button } from "reactstrap";
import { useEffect, useState, useContext } from 'react';
const { TextArea } = Input;
import { useParams, useNavigate } from 'react-router-dom';
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import { AuthContext } from '../contexts/auth.jsx';
import socket from '../utils/socket.js';

function Post({ postDetail }) {
    let params = useParams();

    return (
        <li className={view.history_post} key={params.postid}>
            <div className={view.post} style={{ marginBottom: "10px", textWrap: "wrap", overflowWrap: "break-word", wordBreak: "break-word" }}>
                <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                    <h1 style={{ textWrap: "wrap" }}>{postDetail?.post}</h1>
                    <br />
                    <h5>Author: {postDetail?.author}</h5>
                    <br />
                    <p style={{ textWrap: "wrap" }}>{postDetail?.timestamp.replace('T', " ").slice(0, -5)}</p>
                </div>
            </div>
        </li>
    )
} 

function CommentInput() {
    let params = useParams();

    let { profile, accessToken } = useContext(AuthContext);

    let [content, setContent] = useState("");

    let handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    let handleComment = async () => {
        if (content === "") {
            return;
        }
        socket.emit("send comment", params.postid, { author: profile.username, comment: content, timestamp: new Date(Date.now()).toISOString() } );

        let rawData = await fetch(`/api/post/${params.postid}/comment`, { // create post
            method: 'post',
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: content
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            setContent("");
        } else {
            message.error(data.msg);
        }
    }

    return (
        <>
            {
                accessToken && 
                <>
                    <TextArea
                    // showCount
                    maxLength={300}
                    value={content}
                    onChange={handleChangeContent}
                    placeholder="Enter comment here"
                    style={{ height: 120, resize: 'none', margin: "1%", width: "98%", marginBottom: "0" }}
                    />
                    <Button className={view.btn_fill} style={{ width: "96%", margin: "2%" }} onClick={handleComment}>Comment</Button>
                </>
            }
        </>
    )
} 

function CommentList({ comments }) {
    return (
        <>
            {comments.map((Element, index) => {
                return (
                    <li className={view.history_post} key={index}>
                        <div className={view.post} style={{ marginBottom: "10px", textWrap: "wrap", overflowWrap: "break-word", wordBreak: "break-word" }}>
                            <div style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                <h1 style={{ textWrap: "wrap" }}>{Element.comment}</h1>
                                <br />
                                <h5>Author: {Element.author}</h5>
                                <br />
                                <p style={{ textWrap: "wrap" }}>{Element.timestamp.replace('T', " ").slice(0, -5)}</p>
                            </div>
                        </div>
                    </li>
                )
            })}
        </>
    )
}

export default function PostDetail() {
    let params = useParams();
    let navigate = useNavigate();

    let [postDetail, setPostDetail] = useState(null);
    let [comments, setComments] = useState(new Array);

    useEffect(() => {
        socket.emit("join room", params.postid);

        (async () => {
            let rawData = await fetch(`/api/post/${params.postid}`, {
                method: "get"
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setPostDetail({ post: data.post, author: data.author, timestamp: data.timestamp });
                data.comments.reverse().forEach(Element => {
                    comments.push(Element)
                });
            } else {
                message.error(data.msg);
                navigate('/');
            }
        })()

        socket.on("comment sent", (cmt) => {
            comments.unshift(cmt);
            setComments([ ...comments ]);
        })

        return () => {
            socket.off("comment sent");
        }

    }, [params.postid]);

    return (
        <>
            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1>Post</h1>
                </div>
                <div className={view.table1}>
                    <Post postDetail={postDetail} />
                </div>
                <div className={view.title}>
                    <h1>Comments</h1>
                </div>
                <div className={view.table1}>
                    <CommentInput />
                </div>
                <div className={view.table1}>
                    <CommentList comments={comments} />
                </div>
            </div>
        </>
    )
}