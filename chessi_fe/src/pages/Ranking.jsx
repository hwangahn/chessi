import view from './view.module.css';
import { UserOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import './view.module.css';
import VerticalmenuUser from '../components/verticalmenuUser';
import { useEffect, useState } from 'react';
import { message } from 'antd';
export default function Ranking() {
  let [data, setData] = useState(new Array);

  useEffect(() => {
    (async () => {
      let rawData = await fetch('/api/user/leaderboard', {
        method: "get"
      });

      let data = await rawData.json();

      if (data.status === 'ok') {
        setData(data.leaderboard);
      } else {
        message.error(data.msg);
      }
    })()
  }, [])

  return (
    <>
      <div id="leftbar" style={{ float: "left" }}>
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
            {data.map((item, index) => (
              <li className={view.friend} key={item.userid}>
                <Link to={`/user/${item.userid}`}>
                  <h1 style={{ width: "50px", paddingRight: "40%", marginLeft: "8%" }} key={index + 1}>#{index + 1}.</h1>
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
