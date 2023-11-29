import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Chessboard } from 'react-chessboard';
import { Spin, Button, message } from 'antd'
import TextArea from "antd/es/input/TextArea";
import socket from "../utils/socket";
import { AuthContext } from "../contexts/auth";
import { GameContent, GameContentContext } from "../contexts/gameContent";
import Move from "../components/move";

function GameInfo() {
  let { profile } = useContext(AuthContext);
  let { setSide, setPosition, setHistory, timeLeft, setTimeLeft } = useContext(GameContentContext);

  let [playerInfo, setPlayerInfo] = useState(null);
  let [turn, setTurn] = useState(null);

  let param = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    let joinRoom = () => {
      socket.emit("join room", param.roomid);
    }

    let getGameInfo = async () => {
      let rawData = await fetch(`/api/game-info/${param.roomid}`, {
        method: 'get'
      });

      let data = await rawData.json();

      if (data.status === "ok") {        
        setHistory(data.gameInfo.history);
        setPosition(data.gameInfo.position);
        setPlayerInfo({ white: data.gameInfo.white, black: data.gameInfo.black });
        setTimeLeft(data.gameInfo.timeLeft);
        setTurn(data.gameInfo.turn);
      } else {
        message.error(data.msg);
        navigate('/'); // return to main page
      }
    }

    socket.on("time left", (turn, timeLeft) => { // update game timer
      setTimeLeft(timeLeft);
      setTurn(turn);
    })

    socket.on("connect", async () => {
      joinRoom();
      getGameInfo();
    });

    socket.on("game over", (reason) => {
      message.success(reason, 10);
    })
    
    if (socket.connected) {
      joinRoom();
      getGameInfo();
    } else {
      message.warning("Cannot connect to server");
    }

    return () => {
      socket.off("time left");
      socket.off("connect");
      socket.off("game over");
    }
  }, []);

  useEffect(() => { // runs every re render to set side
    if (profile) {
      setSide(playerInfo?.white.username === profile.username ? "white" : "black");
    }
  })

  return (
    <>
      <p>{`White: ${playerInfo?.white?.username} (${playerInfo?.white?.rating}) ${turn === "w" ? "x" : ""}`}</p>
      <p>{`Black: ${playerInfo?.black?.username} (${playerInfo?.black?.rating}) ${turn === "b" ? "x" : ""}`}</p>
      <p>{`Time left: ${timeLeft}`}</p>
    </>
  )
}

function Board() {
  let { side, position, setPosition, history, setHistory, setOnMove, isOnMove } = useContext(GameContentContext);

  let param = useParams();

  let isLatestMove = history.length - 1 === isOnMove; // check whether the selected move (in turn change the state of the game based on the position when the move is made) is latest

  useEffect(() => {
    socket.on("move made", (move) => {
      history.push(move);
      let newHistory = history.map(Element => { return Element });
      setHistory(prev => newHistory);
      setPosition(prev => move.after);
      setOnMove(history.length - 1); // selecting latest move
    });

		return () => {
			socket.off("move made");
		}
	}, []);

  let handlePieceDrop = (sourceSquare, targetSquare, piece) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: piece[1].toLowerCase() // promotion dialog returns the piece as the promoted piece, not the pawn
    };

    if (isLatestMove && piece.substring(0, 1) === side[0]) { // wrong side
      socket.emit("make move", param.roomid, move);
    }

    return false;
  }

  return (
    <>
      {
        side ? 
        <Chessboard position={position} onPieceDrop={handlePieceDrop} boardOrientation={side} customBoardStyle={{width: "100%"}} animationDuration={100} customDarkSquareStyle={{backgroundColor: "#6d7fd1"}} /> : 
        <Spin/> 
      }
      {side}
    </>
  )
}

function MoveHistory() {
  let { history } = useContext(GameContentContext);
  let moveByPair = new Array;

  let lastMove = useRef(null);

  useEffect(() => {
    lastMove.current.scrollIntoView({behavior: "smooth", block: "nearest"});
  });

  for (let i = 0; i < history?.length; i += 2) {
    moveByPair.push([
      { history: history[i], moveIndex: i },
      { history: history[i + 1], moveIndex: i + 1 }
    ]);
  }

  return (
    <div style={{width: "100%", height: "calc(40vw * 0.45)", marginBottom: "calc(40vw * 0.05)", overflowY: "scroll"}}>
      {moveByPair.map((Element, index) => {
        return <Move movePair={Element} moveOrder={index}/>
      })}
      <div ref={lastMove} style={{height: "0px"}}></div>
    </div>
  )
}

function Chat() {
  let { profile } = useContext(AuthContext);

  let [chatHistory, setChatHistory] = useState(new Array);
  let [message, setMessage] = useState("");

  let lastMessage = useRef(null);

  let param = useParams();

  useEffect(() => {
    socket.on("chat message", (sender, message) => {
      chatHistory.push({ sender: sender, message: message });
      let newChatHistory = chatHistory.map(Element => { return Element });
      setChatHistory(prev => newChatHistory);
    });

    return () => {
      socket.off("chat message");
    }
  }, []);

  useEffect(() => {
    lastMessage.current.scrollIntoView({behavior: "smooth", block: "nearest"});
  });

  let handleSendChat = (e) => {
    e.preventDefault();
    if (message !== "") {
      socket.emit("send message", param.roomid, profile.username, message);
      setMessage(prev => "");
    }
  }

  return (
    <div id="chat" style={{width: "100%", height: "calc(40vw * 0.5)"}}>
      <div id="chat-message" style={{width: "99%", marginLeft: "auto", height: "calc(100% - 67px)", overflowY: "scroll"}}>
        {chatHistory.map(Element => {
          return <p><b>{Element.sender}</b>: {Element.message}</p>
        })}
        <div ref={lastMessage} style={{height: "0px"}}></div>
      </div>
      <div id="message-input" style={{width: "100%", height: "fit-content"}}>
        <TextArea id="message-input" placeholder="Enter your message..." value={message} autoSize={{ minRows: 1, maxRows: 3}} 
        style={{width: "100%"}} onChange={(e) => {setMessage(e.target.value)}} onPressEnter={handleSendChat} />
        <Button id="submit-message" type="primary" style={{width: "100%"}} onClick={handleSendChat}>Send</Button>
      </div>
    </div>
  )
}

export default function Game() {
  return (
    <GameContent>
      <div id="game-info" style={{float: "left", width: "25%"}}>
        <GameInfo />
      </div>
      <div id="game-board" style={{float: "left", width: "40%"}}>
        <Board />
      </div>
      <div id="game-misc" style={{float: "right", width: "30%"}}>
        <MoveHistory />
        <Chat />
      </div>
    </GameContent>
  )
}