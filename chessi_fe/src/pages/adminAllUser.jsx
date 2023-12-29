import view from './view.module.css';
import { Link } from "react-router-dom";
// reactstrap components
import { Table } from "reactstrap";
import VerticalmenuAdmin from './verticalmenuAdmin';
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
                        <th>Status</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                    </thead>

                    <tbody>

                    <tr>
                        <td className={view.Stt}>1</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>1</td>
                        <td>199</td>
                    </tr>
                    <tr>
                        <td className={view.Stt}>2</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>1</td>
                        <td>199</td>
                        
                    </tr>
                    <tr>
                        <td className={view.Stt}>3</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        

                    </tr>
                    <tr>
                        <td className={view.Stt}>4</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        
                    </tr>
                    <tr>
                        <td className={view.Stt}>5</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        

                    </tr>
                    <tr>
                        <td className={view.Stt}>6</td>
                        <td>
                            <Link to={"/admin/History"} style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg' />
                                <p style={{ marginLeft: "5px" }}>Dat 09</p>
                            </Link>
                        </td>
                         <td>100</td>
                        <td>0</td>
                        <td>0</td>
                        <td>199</td>
                        

                    </tr>


                    </tbody>
                </Table>

            </div>


        </div>
        </>
    );
}
