import React from "react";
import { Affix } from 'antd';
import {NavLink, Link, useLocation} from "react-router-dom";
// reactstrap components
import {
    Row, Col, Card, CardHeader, CardBody, Form, FormGroup, Input, CardFooter, Button, CardText, Table,

} from "reactstrap";
import view from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';

export default function FriendList() {
    return (
    <>
    <div id="leftbar" style={{float:"left"}}>
        <VerticalmenuUser />
    </div>
    <div className={view.content}>
        <div className={view.title}>
            <h1>Bạn bè</h1>
        </div>
        <div className={view.table1}>

            <Input placeholder="SEARCH" type="text" className={view.sreachbox}/>
            <h2 style={{paddingTop: "0", paddingLeft: "5%", background: "#2D2C45", color: "white"}}>Bạn bè 5</h2>
            <ul id='friend-list'>
                <li className={view.friend}><Link to='/'>
                        <img src='https://i.imgur.com/nkN3Mv0.jpg'/>
                        <div className={view.name}>
                            <h3>Andres Perez</h3>
                            <p>Hạng</p>
                            <p>Hoạt động 5 giờ trước</p>
                        </div>
                    </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>
                <li className={view.friend}><Link to='/'>
                    <img src='https://i.imgur.com/0I4lkh9.jpg'/>
                    <div className={view.name}>
                        <h3>Leah Slaten</h3>
                        <p>Hạng:121</p>
                        <p>Hoạt động 5 giờ trước</p>
                    </div>
                </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>
                <li className={view.friend}><Link to='/'>
                    <img src='https://i.imgur.com/s2WCwH2.jpg'/>
                    <div className={view.name}>
                        <h3>Mario Martinez</h3>
                        <p>Hạng:212</p>
                        <p>Hoạt động 5 giờ trước</p>
                    </div>
                </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>
                <li className={view.friend}><Link to='/'>
                    <img src='https://i.imgur.com/rxBwsBB.jpg'/>
                    <div className={view.name}>
                        <h3>Cynthia Lo</h3>
                        <p>Hạng: 123</p>
                        <p>Hoạt động 5 giờ trước</p>
                    </div>
                </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>
                <li className={view.friend}><Link to='/'>
                    <img src='https://i.imgur.com/tovkOg2.jpg'/>
                    <div className={view.name}>
                        <h3>Sally Lin</h3>
                        <p>Hạng: 1516</p>
                        <p>Hoạt động 5 giờ trước</p>
                    </div>
                </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>

                <li className={view.friend}><Link to='/'>
                    <img src='https://i.imgur.com/A7lNstm.jpg'/>
                    <div className={view.name}>
                        <h3>Danny Tang</h3>
                        <p>Hạng: 1561</p>
                        <p>Hoạt động 5 giờ trước</p>
                    </div>
                </Link>
                    
                    <Button className={view.btn_fill} type="submit">Hủy theo dõi
                    </Button>
                </li>
            </ul>
        </div>
    </div>
    </>
);
}
