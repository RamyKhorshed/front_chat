import React from "react";

const Message = ({ chat, user }) => (
  <li className={`chat ${user === chat.username ? "right" : "left"}`}>
    {user !== chat.username}
    {chat.content}
    {chat.messagescore}
  </li>
);

export default Message;
