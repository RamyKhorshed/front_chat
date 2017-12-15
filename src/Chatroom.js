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
    this.subscribeChannel();
    this.state = {
      username: this.props.username,
      chats: [
        {
          username: "Kevin Hsu",
          content: <p>Hello World!</p>,
          img: "http://i.imgur.com/Tj5DGiO.jpg"
        }
      ]
    };
    this.submitMessage = this.submitMessage.bind(this);
  }

  subscribeChannel() {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    cable.subscriptions.create("RoomChannel", {
      received: data => {
        this.setState({
          chats: [
            ...this.state.chats,
            { username: data.username, content: data.content }
          ]
        });
      }
    });
  }

  componentDidMount() {
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
        username
      };

      fetch("http://localhost:3000/messages", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(message)
      }).then(res => console.log(res));
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
        <h3>Gravim8</h3>
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
  username: state.auth.currentUser.username
});

export default withAuth(connect(mapStateToProps, actions)(Chatroom));
