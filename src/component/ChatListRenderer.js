import React, { useState, useEffect } from 'react';
import {apiBaseUrl} from '../config/dev'
import { useHistory } from 'react-router-dom';
import Cookies from 'universal-cookie';


import ChatList from './ChatList';

function ChatListRenderer() {
  const [chats, setChats] = useState([]);
  const history = useHistory();


  useEffect(() => {
    fetch(apiBaseUrl + '/exchange-service/chat', {
        method: 'GET',
        credentials: 'include' 
      })
      .then(response => response.json())
      .then(data => setChats(data))
      .catch(error => console.error('Error fetching chats:', error));
      return () => {
        setChats({}); 
      };
  }, []);

  useEffect(() => {
    fetch(apiBaseUrl + '/auth-service/user-info', {
        method: 'GET',
        credentials: 'include' 
      })
      .then(response => response.json())
      .then(data => {
        const cookies = new Cookies();
        cookies.set('username', data.username, { path: '/' });
      })
      .catch(error => console.error('Error fetching chats:', error));
  }, []);

  const handleChatClick = async (chatId) => {
    await fetch(apiBaseUrl + `/exchange-service/chat/join?chatId=${encodeURIComponent(chatId)}`, {
      method: 'POST',
      credentials: 'include' 
    })
    .catch(error => console.error('Error fetching chats:', error));
    history.push(`/chat/${chatId}`);
  };

  return (
    <div>
  
      <ChatList chats={chats} onChatClick={handleChatClick} />
    </div>
  );
}

export default ChatListRenderer;