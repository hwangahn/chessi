import { Link, useNavigate } from "react-router-dom";
// reactstrap components
import { Input, Button } from "reactstrap";
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/auth";
import { message } from "antd";

export default function FriendList() {
    let navigate = useNavigate();

    let { accessToken } = useContext(AuthContext);

    let [users, setUsers] = useState(new Array);

    useEffect(() => {
        (async () => {
            let rawData = await fetch('/api/user/following', {
                method: "get",
                headers: {
                    'authorization': 'Bearer ' + accessToken,
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setUsers(() => {
                    data.following.forEach(Element => { users.push(Element) });
                    return [...users];
                });
            } else {
                message.error(data.error);
                navigate('/');
            }
        })()
    }, [])

    let handleUnfollow = async (userid) => {
        let rawData = await fetch(`/api/user/${userid}/follow`, {
            method: "delete",
            headers: {
                'authorization': 'Bearer ' + accessToken,
            }
        });

        let data = await rawData.json();

        if (data.status === "ok") {
            message.success("Done");
            setUsers(() => {
                users = users.filter(Element => {
                    return Element.userid !== userid;
                });
                return [...users];
            });
        } else {
            message.error(data.msg);
        }
    }

    return (
        <>
            <div id="leftbar" style={{ float: "left" }}>
                <VerticalmenuUser />
            </div>
            <div className={view.content}>
                <div className={view.title}>
                    <h1>Following</h1>
                </div>
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
                                <Button className={view.btn_fill} onClick={() => { handleUnfollow(item.userid) }}>Unfollow</Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
