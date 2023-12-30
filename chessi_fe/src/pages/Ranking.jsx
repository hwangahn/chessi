import React from "react";
import view from './view.module.css';
import { UserOutlined } from '@ant-design/icons';
import {NavLink, Link, useLocation} from "react-router-dom";
// reactstrap components
import {
    Row,
    Col, Card, CardHeader, CardBody, Form, FormGroup, Input, CardFooter, Button, CardText, Table,

} from "reactstrap";
import styles from './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
export default function Ranking() {
    const data = [{
        "userid": 1,
        "username": "something",
        "rating": 1500
      },{
        "userid": 2,
        "username": "something",
        "rating": 1500
      },{
        "userid": 3,
        "username": "something",
        "rating": 1500
      },{
        "userid": 4,
        "username": "something",
        "rating": 1500
      },{
        "userid": 5,
        "username": "something",
        "rating": 1500
      },{
        "userid": 6,
        "username": "something",
        "rating": 1500
      },
      {
        "userid": 7,
        "username": "something",
        "rating": 1500
      },
      {
        "userid": 8,
        "username": "something",
        "rating": 1500
      },
      {
        "userid": 9,
        "username": "something",
        "rating": 1500
      },
      {
        "userid": 10,
        "username": "something",
        "rating": 1500
      },]
    return (
        <>
        <div id="leftbar" style={{float:"left"}}>
            <VerticalmenuUser />
        </div>
        <div className={view.content}>
            
            <div className={view.title}>
                <h1 >Ranking</h1>
            </div>
            <div className={view.table1}>
            <div className={view.title}>
            <h1 >Top 10</h1>
            </div>

        <ul id='friend-list'>
        {data.slice(0, 10).map((item, index) => (
              <li className={view.friend} key={item.userid}>
                <Link to='/'>
                  <h1 style={{width:"50px",paddingRight:"50%"}}key={index + 1}>#{index + 1}.</h1>
                  <div className={view.name}>
                    <h2>{item.username}</h2>
                    <p>Rating: {item.rating}</p>
                    <p>Id: {item.userid}</p>
                  </div>
                </Link>
                <Button className={view.btn_fill} type="submit">Theo dõi</Button>
              </li>
            ))}
 
</ul>
</div>

        </div>
        </>
    );
}
