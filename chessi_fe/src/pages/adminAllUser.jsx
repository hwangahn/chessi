import view from './view.module.css';
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined } from '@ant-design/icons';
import { Table } from "reactstrap";
import VerticalmenuAdmin from '../components/verticalmenuAdmin';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/auth';
import { message } from 'antd';
export default function AdminAllUser() {
    let navigate = useNavigate();

    let { accessToken } = useContext(AuthContext);

    let [users, setUsers] = useState(new Array);

    useEffect(() => {
        (async () => {
            let rawData = await fetch('/api/admin/all-user', {
                method: 'get',
                headers: {
                    "authorization": "Bearer " + accessToken
                }
            });

            let data = await rawData.json();

            if (data.status === "ok") {
                setUsers(() => {
                    data.user.forEach(Element => {
                        users.push(Element);
                    });
                    return [ ...users ];
                })
            } else {
                message.error(data.msg);
                navigate('/');
            }
        })()
    }, [])

    return (
        <>
        <div id="leftbar" style={{float:"left"}}>
            <VerticalmenuAdmin />
        </div>
        <div className={view.content}>
            
            <div className={view.title}>
                <h1 style={{textAlign:"center"}}></h1>
            </div>
            <div className={view.ranking_table} >

                {/*<Input placeholder="SEARCH" type="text" className="sreachbox"/>*/}
                <Table className={view.tablesorter}>
                    <thead className="text-primary">
                    <tr style={{paddingTop:"0",paddingLeft:"5%", background:"#2D2C45",color:"white", height:"30px"}}>
                        <th className="Stt2">STT</th>
                        <th style={{width:"40%"}}>Username</th>
                        <th>Rating</th>
                    </tr>
                    </thead>

                    <tbody>
                        {users.map((Element, index) => (

                                <tr>
                                                                
                                    <td className={view.Stt}>{index}</td>
                                    <td><Link to={`/user/${Element.userid}`}><UserOutlined style={{marginRight: "0.3vw"}} /> {Element.username}</Link></td>
                                    <td>{Element.rating}</td>
                        
                                </tr>
                        ))}
                    </tbody>
                </Table>

            </div>


        </div>
        </>
    );
}
