import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as actions from "./actions";
import "./App.css";
import ActionCable from "actioncable";
import withAuth from "./hocs/withAuth";

import Message from "./Message.js";

class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      chat_key: 1,
      chats: [
        {
          username: "Kevin Hsu",
          content: <p>Hello World!</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        }
      ],
      channelCable: {}
    };
    this.submitMessage = this.submitMessage.bind(this);
  }

  subscribeChannel = key => {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    const channelSubscription = cable.subscriptions.create(
      { channel: "RoomChannel", chat_key: key },
      {
        received: data => {
          this.setState({
            chats: [
              ...this.state.chats,
              {
                username: data.username,
                content: data.content,
                messagescore: data.messagescore
              }
            ]
          });
        }
      }
    );
    this.setState({
      channelCable: channelSubscription
    });
  };

  getChat = (id, friend_id) => {
    let current_chat = friend_id;
    let url =
      "http://localhost:3000/api/v1/chats/" + id + "/?a=" + current_chat;

    fetch(url)
      .then(res => res.json())
      .then(res => {
        let responseData = res;
        let messages = responseData.chat_messages;
        let chat_id = responseData.chat_id;

        this.setState({
          chat_key: chat_id,
          chats: messages
        });
        console.log(this.state.chat_key);
        this.subscribeChannel(this.state.chat_key);
      });
  };

  clearChat = () => {
    this.setState({
      chats: []
    });
  };

  componentDidMount() {
    this.clearChat();
    this.getChat(this.props.id, this.props.current_chat);
    this.scrollToBot();
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.current_chat);
    this.clearChat();
    this.getChat(nextProps.id, nextProps.current_chat);
    this.scrollToBot();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
      this.refs.chats
    ).scrollHeight;
  }

  submitMessage(e) {
    e.preventDefault();

    let content = ReactDOM.findDOMNode(this.refs.msg).value;
    if (content !== "") {
      let username = this.props.username;
      let message = {
        content,
        username,
        chat: this.state.chat_key
      };

      fetch("http://localhost:3000/messages", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(message)
      });
      this.clearMessage();
    }
  }

  clearMessage() {
    ReactDOM.findDOMNode(this.refs.msg).value = "";
  }

  render() {
    const username = this.state.username;
    const { chats } = this.state;
    const chatsonpage = chats.map(chat => (
      <Message chat={chat} user={username} />
    ));

    return (
      <div className="chatroom">
        <h3>{this.props.current_chat}</h3>
        <ul className="chats" ref="chats">
          {chatsonpage}
        </ul>
        <form className="input" onSubmit={e => this.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.currentUser.username,
  id: state.auth.currentUser.id
});

export default withAuth(connect(mapStateToProps, actions)(Chatroom));
