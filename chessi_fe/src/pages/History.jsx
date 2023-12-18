import React from "react";
import view from './view.module.css';
import {NavLink, Link, useLocation} from "react-router-dom";
import {
    Row,
    Col, Card, CardHeader, CardBody, Form, FormGroup, Input, CardFooter, Button, CardText, Table,

} from "reactstrap";
import Verticalmenu from './verticalmenu';

export default function History() {
    return (
        <>
        
        <div id="leftbar" style={{float:"left"}}>
            <Verticalmenu />
        </div>   
        <div className={view.content}>
        <div className={view.title}>
            <h1>Lịch sử đấu </h1>
        </div>

                <div className={view.Profile}>
                    <img src="https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg"
                         className={view.Profile_image}/>
                    <div className={view.Profile_text}>
                        <h1> Dat 09</h1>
                        <p>Không là nhà vô địch nhưng tôi có người yêu</p>
                    </div>
                    <div className={view.Profile_button}>
                        <Button className={view.btn_fill} type="submit">Kết bạn
                        </Button>
                        <Button className={view.btn_fill} type="submit">Kết bạn
                        </Button>
                        <Button className={view.btn_fill}  type="submit">Kết bạn
                        </Button>
                        <Button className={view.btn_fill}  type="submit">Kết bạn
                        </Button>
                    </div>

                </div>
                <div className={view.table2}>
                    <div className={view.author}>

                        <h2 className={view.title}>Trận đấu đang diễn ra</h2>
                        <p className={view.description}>Không có trận đấu nào đang diễn ra</p>
                    </div>
                </div>

                <div className={view.table1}>
                    <h2 style={{textAlign: "center"}}>Lịch sử đấu</h2>
                    <Input placeholder="SEARCH" type="text" className={view.sreachbox}/>

                    <Table className={view.tablesorter}>
                        <thead className={view.text_primary}>
                        <tr>
                            <th style={{textAlign: "left"}}>Đối thủ</th>
                            <th>Kết quả</th>
                            <th className={view.text_center}>Số nước đi</th>
                            <th> Ngày</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td style={{display: "flex", alignItems: "center"}}>
                                <img style={{width: "50px", height: "50px", borderRadius: "50%"}}
                                     src='https://png.pngtree.com/element_origin_min_pic/17/09/17/f3b45173e323d174be4fd3ce92053df0.jpg'/>
                                <p style={{marginLeft: "6px", alignSelf: "center"}}>asdsakjd</p>
                            </td>
                            <td>-100</td>
                            <td className={view.text_center}>1500</td>
                            <td>30/02/2003</td>
                        </tr>
                        </tbody>
                    </Table>
                </div>
        </div>
        </>
    )
        ;
}
