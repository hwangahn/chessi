import { Flex, Input } from 'antd';
import { Button } from "reactstrap";
import { useState } from 'react';
const { TextArea } = Input;
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';


export default function CreatePost() {
    let [content, setContent] = useState("");

    let handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    return (
        <>

            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
            <div className={view.title}>
            <h1>Post</h1>
        </div>
            <div  className={view.table1}>
                <TextArea 
                    // showCount
                    maxLength={300}
                    onChange={handleChangeContent}
                    placeholder="Enter post here"
                    style={{ height: 120, resize: 'none', margin:"1%", width:"98%",marginBottom:"0" }}
                />
                <Button className={view.btn_fill} style={{width:"96%" , margin:"2%"}}>Post</Button>
            </div>
            </div>
        </>
    )
}