import { Flex, Input, Button } from 'antd';
import { useState } from 'react';
const { TextArea } = Input;
import view from './view.module.css';

export default function CreatePost() {
    let [content, setContent] = useState("");

    let handleChangeContent = (e) => {
        setContent(e.target.value)
    }

    return (
        <div>
            <TextArea
                showCount
                maxLength={300}
                onChange={handleChangeContent}
                placeholder="Enter post here"
                style={{ height: 120, resize: 'none' }}
            />
            <Button className={view.btn_fill}></Button>
        </div>
    )
}