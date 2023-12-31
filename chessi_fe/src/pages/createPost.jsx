import { Input, message } from 'antd';
import { Button } from "reactstrap";
import { useEffect, useState, useContext } from 'react';
const { TextArea } = Input;
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import SinglePost from '../components/singlePost.jsx'
import { AuthContext } from '../contexts/auth.jsx';

function CreatePost({ addPost }) {
    let { profile, accessToken } = useContext(AuthContext);

    let [content, setContent] = useState("");

    let handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    let handlePost = async () => {
        let rawData = await fetch('/api/post', { // create post
            method: 'post',
            headers: {
                'authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                post: content
            })
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            addPost({ postid: data.postid, post: data.post, timestamp: data.timestamp, author: profile.username });
            setContent("");
        } else {
            message.error(data.msg);
        }
    }

    return (
        <>
            <TextArea
                // showCount
                maxLength={300}
                value={content}
                onChange={handleChangeContent}
                placeholder="Enter post here"
                style={{ height: 120, resize: 'none', margin: "1%", width: "98%", marginBottom: "0" }}
            />
            <Button className={view.btn_fill} style={{ width: "96%", margin: "2%" }} onClick={handlePost}>Post</Button>
        </>
    )
}

function LatestPost({ latestPosts }) {
    return (
        <ul>
            {latestPosts && latestPosts.map((post, index) => (
                <SinglePost post={post} index={index} />
            ))}
        </ul>
    )
}

export default function Post() {
    let [latestPosts, setLatestPosts] = useState(new Array);

    let addPost = (postobj) => {
        latestPosts.unshift(postobj); // add to front of array
        setLatestPosts([ ...latestPosts ]);
    }

    useEffect(() => {
        (async () => {
            let rawData = await fetch('/api/post', {
                method: 'get'
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setLatestPosts(data.posts);
            } else {
                message.error(data.msg);
            }
        })()
    }, [])

    return (
        <>
            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1>Create post</h1>
                </div>
                <div className={view.table1}>
                    <CreatePost addPost={addPost} />
                </div>
                <div className={view.table1}>
                    <LatestPost latestPosts={latestPosts} />
                </div>
            </div>
        </>
    )
}