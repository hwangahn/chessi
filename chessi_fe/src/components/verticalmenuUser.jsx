import { useNavigate } from 'react-router-dom';
import { Affix, message } from 'antd';
import { TrophyOutlined } from "@ant-design/icons"
import { Link } from 'react-router-dom';
import { AuthContext } from "../contexts/auth"
import { useContext } from "react"

export default function verticalmenuUser() {
    let navigate = useNavigate();

    let { useLogout, profile } = useContext(AuthContext);
    let handleLogout = async () => {
        let { status, msg } = await useLogout();

        (status === "ok") ? message.success(msg) : message.error(msg);

        if (status === "ok") {
            navigate('/');
        }
    }
    const userId = profile?.userid;

    return (
        <>
            {
                profile && !profile.isAdmin &&
                <Affix offsetTop={65}>
                    <div id="leftbar">
                        <ul className="single-vertical-menu">
                            <li>
                                <img src="../../public/choi.png" alt="" />
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <img src="../../public/friend.png" alt="" />
                                <Link to="/following">Follow</Link>
                            </li>
                            <li>
                                <img src="../../public/history.png" alt="" />
                                <Link to={`/user/${userId}`}>User</Link>
                            </li>
                            <li>
                                    <TrophyOutlined style={{
                                        color: "#F59E0B", 
                                        fontSize: "24px",     // controls both width & height
                                        lineHeight: "1",
                                    }} />
                                <Link to="/tournaments">Tournaments</Link>
                            </li>
                            <li>
                                <img src="../../public/diendan.png" alt="" />
                                <Link to="/post">Post</Link>
                            </li>
                            <li>
                                <img src="../../public/ranking.png" alt="" />
                                <Link to="/ranking">Ranking</Link>
                            </li>
                        </ul>
                        <div className="logoutButton">
                            <img src="../../public/logout-button.png" alt="" style={{ float: "left", marginLeft: "15%", marginTop: "0.75vw", width: "1.6vw" }} />
                            <span onClick={handleLogout} style={{ color: "#FFFFFF", float: "left", marginLeft: "10%", marginTop: "0.7vw", fontSize: "1.1vw" }}>Log out</span>
                        </div>
                    </div>
                </Affix>
            }
        </>
    )
}

