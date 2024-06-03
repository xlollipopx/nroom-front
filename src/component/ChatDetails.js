import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiBaseUrl } from '../config/dev';
import Cookies from "js-cookie";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';


import './ChatRoom.css';

var stompClient = null;

function ChatDetails() {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState({});
  const [user, setUser] = useState({
    connected: false,
    message: ''
  });

  useEffect(() => {
    connect();
  }, [chatId]);


  useEffect(() => {
    setUser({
      username: Cookies.get('username')
    })
    console.log(user)

    fetch(apiBaseUrl + `/exchange-service/chat/info/${chatId}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        setChat(data);
        setUsers(data.personInfoList.map(p => p.username));
      })
      .catch(error => console.error('Error fetching chat details:', error));

    return () => {
      setChat({});
    };
  }, [chatId]);


  useEffect(() => {
    setUser({
      username: Cookies.get('username')
    })
    console.log(user)

    fetch(apiBaseUrl + `/exchange-service/chat/messages?chatId=${encodeURIComponent(chatId)}`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        console.log("MESSAGES: ")
        console.log(data)
        setMessages(data);
      })
      .catch(error => console.error('Error fetching messages details:', error));

    return () => {
      setMessages({});
    };
  }, [chatId]);

  const connect = () => {
    let Sock = new SockJS(apiBaseUrl + '/messaging-service/ws', null, { withCredentials: true });
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  }

  const onConnected = () => {
    setUser({ ...user, "connected": true });
    stompClient.subscribe('/chatroom/public/' + chatId, onMessageReceived);
    stompClient.subscribe('/chatroom/user-join/' + chatId, onUserJoin);

    userJoin();
  }

  const userJoin = () => {
    var chatMessage = {
      username: Cookies.get('username'),
      status: "JOIN"
    };
    stompClient.send("/messaging-service/user-join/" + chatId, {}, JSON.stringify(chatMessage));
  }

  const onUserJoin = (payload) => {
    var payloadData = JSON.parse(payload.body);
    alert("User " + payloadData.username + " joined!")
  }

  const onError = (err) => {
    console.log(err);

  }

  const handleMessage = (event) => {
    const { value } = event.target;
    setUser({ ...user, "message": value });
  };

  const onMessageReceived = (payload) => {
    var payloadData = JSON.parse(payload.body);
    setMessages(prevMessages => [...prevMessages, payloadData]);
  }

  const sendValue = () => {
    if (stompClient) {
      var chatMessage = {
        senderName: Cookies.get('username'),
        value: user.message
      };
      stompClient.send("/messaging-service/message/" + chatId, {}, JSON.stringify(chatMessage));
      setUser({ ...user, "message": "" });
    }
  }

  return (

    <div className="container">
      <div className="chat-box">
        <div className="member-list">
          <ul>
            <li onClick={() => { }} className={`member ${"active"}`}>{chat.name}</li>
            {users.map((personName, index) => (
              <li onClick={() => { }} className={`member `} key={index}>{personName}</li>
            ))}
          </ul>
        </div>
        <div className="chat-content">
          <ul className="chat-messages">
            {messages.map((message, index) => (
              <li className={`message ${message.senderName === Cookies.get('username') && "self"}`} key={index}>
                {message.senderName !== Cookies.get('username') && <div className="avatar">{message.senderName}</div>}
                <div className="message-data">{message.value}</div>
                {message.senderName === Cookies.get('username') && <div className="avatar self">{message.senderName}</div>}
              </li>
            ))}
          </ul>

          <div className="send-message">
            <input type="text" className="input-message" placeholder="enter the message" value={user.message} onChange={handleMessage} />
            <button type="button" className="send-button" onClick={sendValue}>send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatDetails;