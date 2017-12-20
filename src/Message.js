import React from "react";

const Message = ({ chat, user }) => (
  <li className={`chat ${user === chat.username ? "right" : "left"}`}>
    {user !== chat.username}
    <h2>{chat.content}</h2>
    <p>{chat.messagescore}</p>
  </li>
);

export default Message;
