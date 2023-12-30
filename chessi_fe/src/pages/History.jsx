import view from './view.module.css';
import { Chessboard } from 'react-chessboard';
import { Link } from "react-router-dom";
import { Input,  Button } from "reactstrap";

import VerticalmenuUser from '../components/verticalmenuUser';

import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { message, Space } from 'antd';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  // datalabels
} from 'chart.js';
import { AuthContext } from '../contexts/auth';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);


export default function History() {
  let { profile } = useContext(AuthContext);

  let [ratingChange, setRatingChange] = useState(null);
  let [gameHistory, setGameHistory] = useState(null);
  let [username, setUsername] = useState(null);
  let [rating, setRating] = useState(null);
  let [posts, setPosts] = useState(null);
  let [historyType, setHistoryType] = useState('game');
  let params = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let rawData = await fetch(`/api/user/${params.userid}`, {
        method: "GET",
      });
      let data = await rawData.json();
      if (data.status != "ok") {
        message.error(data.msg);
        navigate("/");
      } else {
        setRating(data.rating);
        setUsername(data.username);
        setGameHistory(data.gameHistory);
        setRatingChange(data.ratingChange);
        setPosts(data.posts);
        console.log(ratingChange["rating"]);
      }
    })()

  }, [params.userid])

  const chartRating = [];
  const chartTime = [];
  for (let i = 0; i < ratingChange?.length; i++) {
    chartRating[i] = ratingChange[i]["rating"];
    chartTime[i] = ratingChange[i]["timestamp"]
  }
  console.log(chartRating);
  const dataChart = {
    labels: chartTime,
    datasets: [
      {
        label: "Rating",
        fill: true,
        borderColor: "#1f8ef1",
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: "#1f8ef1",
        pointBorderColor: "rgba(255,255,255,0)",
        pointHoverBackgroundColor: "#1f8ef1",
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 4,
        data: chartRating,
      },],

  };
  const options = {
    scales: {
      x: {
        ticks: {
          display: false
        }
      }
    }
  };


  return (
    <>
      <div id="leftbar" style={{ float: "left" }}>
        <VerticalmenuUser />
      </div>
      <div className={view.content}>
        <div className={view.title}>
          <h1 style={{ textShadow: "0 0 1.3 #396FAE" }}>User profile</h1>
        </div>
        <div className={view.Profile}>
          <div className={view.Profile_text}>
            <h1> {username}</h1>
            <br />
            <h4>Trạng thái hoạt động</h4>
          </div>
          <div className={view.Profile_button}>
            {
              profile.userid == params.userid ?
              <Button className={view.btn_fill} type="submit" onClick={() => { navigate('/change-password') }}>Change password</Button> :
              <>
                <Button className={view.btn_fill} type="submit">Follow</Button>
                <Button className={view.btn_fill} type="submit">Spectate</Button>
              </>
            }
          </div>
          <div className={view.chartProfile} style={{ height: "auto" }}>
            <h2>Current rating:{rating}</h2>
            <Line
              data={dataChart}
              options={options}
            />

          </div>
        </div>

        <div className={view.table1}>
          <Button className={view.btn_fill} type="submit" onClick={() => { setHistoryType('game') }}>Game history
          </Button>
          <Button className={view.btn_fill} type="submit" onClick={() => { setHistoryType('post') }}>Post history
          </Button>
          {
            historyType === 'game' ?  
            <>
              <h2 style={{ paddingTop: "0", paddingLeft: "5%", background: "#2D2C45", color: "white" }}>History</h2>
              <ul id="game-history-list">
                {gameHistory && gameHistory.map((game, index) => (
                  <li className={view.history} key={index}>
                    <Link to={`/game/played/${game.gameid}`}>
                      <div className={view.history_board} style={{ width: "250px" }}>
                        <Chessboard id={game.gameId} arePiecesDraggable={false} position={game.finalFen} customDarkSquareStyle={{backgroundColor: "#6d7fd1"}} />
                      </div>
                      <div style={{ minWidth: "200px", marginTop: "-15%" }}>
                        <h1>{game.reason}</h1>
                        <p>{game.timestamp}</p>
                      </div>
                      <div className={view.name} style={{ minWidth: "200px", textAlign: "right" }}>
                        <h2>{game.white}</h2>
                        <h3 style={game.whiteRatingChange >= 0 ? { color: "green", paddingLeft: "5px" } : { color: "red", paddingLeft: "5px" }}>
                          Rating:
                          {game.whiteRatingChange >= 0 ? " +" : " "}
                          {game.whiteRatingChange}
                        </h3>
                      </div>
                      <img src="../public/Vs.png" style={{ width: "100px" }} />
                      <div className={view.name} style={{ minWidth: "200px" }}>
                        <h2>{game.black}</h2>
                        <h3 style={game.blackRatingChange >= 0 ? { color: "green" } : { color: "red" }}>
                          Rating:
                          {game.blackRatingChange >= 0 ? " +" : " "}
                          {game.blackRatingChange}
                        </h3>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
            :
            <>
              <h2 style={{ paddingTop: "0", paddingLeft: "5%", background: "#2D2C45", color: "white" }}>Post</h2>
              <ul id="post-history-list">
                {posts && posts.map((post, index) => (
                  <div className={view.table1} key={index}>
                    <Link to="/">
                      <div style={{ width: "100%", paddingTop: "10px", paddingBottom: "10px" }}>
                        <h1>{post.post}</h1>
                        <br />
                        <h4>Author: {post.username}</h4>
                        <br />
                        <p>{post.timestamp}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </ul>
            </>
          }
        </div>
      </div>
    </>
  )
}


