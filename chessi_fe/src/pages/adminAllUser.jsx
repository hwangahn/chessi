import view from './view.module.css';
import { Link } from "react-router-dom";
// reactstrap components
import { UserOutlined } from '@ant-design/icons';
import { Table } from "reactstrap";
import VerticalmenuAdmin from '../components/verticalmenuAdmin';
export default function AdminAllUser() {
    return (
        <>
        <div id="leftbar" style={{float:"left"}}>
            <VerticalmenuAdmin />
        </div>
        <div className={view.content}>
            
            <div className={view.title}>
                <h1 style={{textAlign:"center"}}>Bảng xếp hạng</h1>
            </div>
            <div className={view.ranking_table} >

                {/*<Input placeholder="SEARCH" type="text" className="sreachbox"/>*/}
                <Table className={view.tablesorter}>
                    <thead className="text-primary">
                    <tr style={{paddingTop:"0",paddingLeft:"5%", background:"#2D2C45",color:"white", height:"30px"}}>
                        <th className="Stt2">STT</th>
                        <th style={{width:"40%"}}>Username</th>
                        <th>Email</th>
                        <th>Password</th>
                        <th>Edit</th>
                        <th>Add</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>

                    <tr>
                        <td className={view.Stt}>1</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>1</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>
                    </tr>
                    <tr>
                        <td className={view.Stt}>2</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>1</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>
                    </tr>
                    <tr>
                        <td className={view.Stt}>3</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>

                    </tr>
                    <tr>
                        <td className={view.Stt}>4</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>
                    </tr>
                    <tr>
                        <td className={view.Stt}>5</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>

                    </tr>
                    <tr>
                        <td className={view.Stt}>6</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center", marginLeft: "0.5vw" }}>
                            <UserOutlined style={{marginRight: "0.3vw"}} />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        <td><img src="../../public/x-regular-24.png" style = {{marginTop: "0.3vw",cursor: "pointer"}}/></td>

                    </tr>


                    </tbody>
                </Table>

            </div>


        </div>
        </>
    );
}
