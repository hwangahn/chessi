import { useContext, useState, useRef, useEffect } from "react";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { AuthContext } from "../contexts/auth";
import socket from '../utils/socket';

export default function Chat({ roomid }) {
    let { profile } = useContext(AuthContext);

    let [chatHistory, setChatHistory] = useState(new Array);
    let [message, setMessage] = useState("");

    let lastMessage = useRef(null);

    useEffect(() => {
        socket.on("chat message", (sender, message) => {
            chatHistory.push({ sender: sender, message: message });
            let newChatHistory = chatHistory.map(Element => { return Element });
            setChatHistory(prev => newChatHistory);
        });

        return () => {
            socket.off("chat message");
        }
    }, []);

    useEffect(() => {
        lastMessage.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    let handleSendChat = (e) => {
        e.preventDefault();
        if (message !== "") {
            socket.emit("send message", roomid, profile.username, message);
            setMessage(prev => "");
        }
    }

    return (
        <div id="chat" style={{ backgroundColor: "#1E1D2F", width: "92%", height: "calc(60vw * 0.5)", paddingBottom: "10px" }}>
            <div style={{width: "100%", backgroundColor: "rgb(45, 44, 69)", color: "white", height: "2vw", padding: "0.4vw 0.5vw", fontSize: "1.1vw"}}>Phòng trò chuyện</div>
            <div id="chat-message" style={{ width: "97%", marginLeft: "3%", paddingTop: "2%", height: "calc(100% - 110px)", overflowY: "auto", fontSize: "1.2vw", color: "#B0ABAB" }}>
                {chatHistory.map(Element => {
                    return <p><b>{Element.sender}</b>: {Element.message}</p>
                })}
                <div ref={lastMessage} style={{ height: "0px" }}></div>
            </div>
            <div id="message-input" style={{ width: "92%", height: "fit-content", marginLeft: "0.7vw", marginTop: "1vw" }}>
                <TextArea id="message-input" placeholder="Enter your message..." value={message} autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ width: "100%" }} onChange={(e) => { setMessage(e.target.value) }} onPressEnter={handleSendChat} />
                <Button id="submit-message" type="primary" style={{ width: "100%" }} onClick={handleSendChat}>Send</Button>
            </div>
        </div>
    )
}