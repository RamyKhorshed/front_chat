import React, { Component } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Chatroom from "./Chatroom";
import * as actions from "./actions";
import { Grid, Button, Segment } from "semantic-ui-react";
import Message from "./Message.js";

class Chat extends Component {
  clearMessage() {
    ReactDOM.findDOMNode(this.refs.msg).value = "";
  }

  clearChat = () => {
    this.setState({
      chats: []
    });
  };

  componentDidMount() {
    this.clearChat();
    this.scrollToBot();
  }

  componentWillReceiveProps(nextProps) {
    this.clearChat();
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

  render() {
    let chatsonpage = this.props.chat.map(chat => (
      <Message chat={chat} user={this.props.username} />
    ));

    return (
      <div className="chatroom">
        <h3>{this.props.current_chat}</h3>
        <ul className="chats" ref="chats">
          {chatsonpage}
        </ul>
        <form className="input" onSubmit={e => this.props.submitMessage(e)}>
          <input type="text" ref="msg" />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default connect(null, actions)(Chat);
