import React from 'react';
import './ChatList.css';

function ChatList({ chats, onChatClick }) {
  return (
    <div className="chat-list-container">
      <div className="chat-list">
        <h2>Chat List</h2>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              className="chat-item"
              onClick={() => onChatClick(chat.id)}
            >
              {chat.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChatList;