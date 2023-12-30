import {Link} from 'react-router-dom';
import './TrangChu.css';
import { Affix, Input } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { AuthContext } from "../contexts/auth"
import { useContext, useState } from "react"

export default function header() {
    let { accessToken, profile } = useContext(AuthContext);
    const [keyword, setKeyword] = useState("");
    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const information = {color:"#B0ABAB",fontSize: "1.6vw", fontWeight: "bold", cursor: "pointer"}

    return(
        <Affix offsetTop={8}> 
        <div className="header">
            <div className="home">
                <Link to={"/"}><img className="logo" src="../../public/Chessi.png" alt=""/></Link>
            </div>
            <div >
            <Input.Search 
                        type="text"
                        className="searchbox"
                        placeholder="Tìm kiếm..."
                        value={keyword}
                        onChange={handleKeywordChange}
                        onSearch={() => {
                            if (keyword) {
                                window.location.href = `/search?keyword=${keyword}&type=user`;
                            }
                        }}
                    />
            </div>
            <div className="right_item">
                {
                    accessToken ?
                    <div style={information}>
                        <UserOutlined style={{marginRight: "0.3vw"}} />
                        {profile.username}
                    </div> :
                    <>
                    <div>
                        <Link to={"/signup"}><Button style={{marginRight: "10px"}}>Signup</Button></Link>
                        <Link to={"/login"}><Button type='primary'>Login</Button></Link>
                    </div>
                    </>
                }
            </div>
        </div>
        </Affix>
    )
}
