// import React from "react";
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import { useState, useEffect } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { Button } from 'antd';

export default function Search() {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let keyword = params.get('keyword');
    let [users, setUsers] = useState(new Array);

    let navigate = useNavigate();

    useEffect(() => {
        (async () => {
            let rawData = await fetch(`/api/search?keyword=${keyword}&type=user`, {
                method: 'get'
            });

            let data = await rawData.json();

            setUsers(() => {
                data.result.forEach(Element => { users.push(Element) });
                return [ ...users ];
            });
        })()
    }, [])

    return (
        <>
            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1 style={{ textShadow: "0 0 1.3 #396FAE" }}>Search</h1>
                </div>
                {/* <div className={view.Profile}>
                    <div className={view.Profile_text}>
                        <Button className={view.btn_fill} type="submit" onClick={{}}>Follow</Button>
                        <Button className={view.btn_fill} type="submit" onClick={{}}>Spectate</Button>
                    </div>
                </div> */}
                <div className={view.table1}>
                    <ul id='friend-list'>
                        {users.map((item, index) => (
                            <li className={view.friend} key={item.userid}>
                                <Link to={`/user/${item.userid}`}>
                                    <h1 style={{ width: "50px", paddingRight: "30%", marginLeft: "8%" }} key={index + 1}>#{index + 1}.</h1>
                                    <div className={view.name}>
                                        <h2>{item.username}</h2>
                                        <p>Rating: {item.rating}</p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            {/* </div> */}
        </>
    )
        ;
}

