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
  let { setSide, setPosition, setOnMove, history, setHistory, timeLeft, setTimeLeft } = useContext(GameContentContext);

  let [playerInfo, setPlayerInfo] = useState(null);
  let [turn, setTurn] = useState(null);

 
  useEffect(() => { // runs every re render to set side
    if (profile?.username !== playerInfo?.white.username && profile?.username !== playerInfo?.black.username) {
      setSide("spectator");
    } else {
      setSide(playerInfo?.white.username === profile?.username ? "white" : "black");
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
      setHistory([ ...history ]);
      setPosition(move.after);
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
        <Chessboard id={1000000000} position={position} onPieceDrop={handlePieceDrop} boardOrientation={side} customBoardStyle={{width: "100%"}} animationDuration={0} customDarkSquareStyle={{backgroundColor: "#6d7fd1"}} /> : 
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
    <div style={{width: "100%", height: "calc(17vw)", marginBottom: "calc(40vw * 0.05)", overflowY: "auto"}}>
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
    <div id="chat" style={{backgroundColor: "#1E1D2F", width: "92%", height: "calc(40vw)", padding: "10px 0px"}}>
      <div id="chat-message" style={{width: "99%", marginLeft: "auto", height: "calc(100% - 67px)", overflowY: "scroll"}}>
        {chatHistory.map(Element => {
          return <p><b>{Element.sender}</b>: {Element.message}</p>
        })}
        <div ref={lastMessage} style={{height: "0px"}}></div>
      </div>
      <div id="message-input" style={{width: "92%", height: "fit-content", marginLeft: "1vw"}}>
        <TextArea id="message-input" placeholder="Enter your message..." value={message} autoSize={{ minRows: 1, maxRows: 3}} 
        style={{width: "100%"}} onChange={(e) => {setMessage(e.target.value)}} onPressEnter={handleSendChat} />
        <Button id="submit-message" type="primary" style={{width: "100%"}} onClick={handleSendChat}>Send</Button>
      </div>
    </div>
  )
}

export default function GameHistory() {

  const leftbar = {
    float:"left",
    width: "27.5%",
    marginTop: "0px",
    paddingTop: "2.1vw",
    paddingLeft: "2vw"
  };

  const rightbar = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "4%",
    marginTop: "23%",
    justifyContent: "center"
}

const playerComponent = {
    display: "flex",
    flexDirection: "row"
}

const playerAva = {
    margin: "1vw 5.5vw 0.5vw 0vw",
    color: "#B0ABAB",
    fontSize: "1.6vw",
    fontWeight: "bold"
}

const playerTimer = {
    color: "#B0ABAB",
    fontSize: "1.6vw",
    marginTop: "1.5vw",
    paddingTop: "0.33vw",
    backgroundColor: "#1E1D2F",
    width: "6.5vw",
    height: "2.4vw",
    textAlign: "center",
    borderRadius: "15px"
}

const gameComponent = {
    backgroundColor: "#1E1D2F",
    width: "93%",
    height: "17vw"
}


  return (
    <GameContent>
    <div style={leftbar}>
      <div style={{color: "#BEC1DC"}}>
        <Chat />
      </div>
    </div>
      <div id="game-board" style={{float: "left", width: "42%"}}>
        <Board />
      </div>
      <div id="game-misc" style={{float: "right", width: "30%"}}>
      <div style = {rightbar}>
                <div style = {playerComponent}>
                    <div style = {playerAva}>
                        <img src="" alt="" style = {{width: "3.3vw", height: "3.3vw"}}/>
                        <span style = {{position: "relative", bottom: "2vw", marginLeft: "0.7vw"}}>Name (point)</span>
                    </div>
                    <div style = {playerTimer}>10:00</div>
                </div>
                <div style = {gameComponent}>
                    <div style={{color: "#BEC1DC"}}>
                        <MoveHistory />
                    </div>
                </div>
                <div style = {playerComponent}>
                    <div style = {playerAva}>
                        <img src="" alt="" style = {{width: "3.3vw", height: "3.3vw"}}/>
                        <span style = {{position: "relative", bottom: "2vw", marginLeft: "0.7vw"}}>Name (point)</span>
                    </div>
                    <div style = {playerTimer}>10:00</div>
                </div>
            </div>
      </div>
    </GameContent>
  )
}