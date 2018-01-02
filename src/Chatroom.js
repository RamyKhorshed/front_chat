import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as actions from "./actions";
import { Segment, Progress, Statistic, Button } from "semantic-ui-react";
import "./App.css";
import ActionCable from "actioncable";

import Stats from "./Stats.js";
import Message from "./Message.js";
import PersonalityChart from "./PersonalityChart.js";

class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      chat_key: 1,
      chats: [],
      channelCable: {},
      friend_sentiment: 0,
      my_sentiment: 0,
      friend_sentiment_overall: 0,
      my_sentiment_overall: 0,
      word_count: 0,
      chart: false
    };
  }

  subscribeChannel = key => {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    const channelSubscription = cable.subscriptions.create(
      { channel: "RoomChannel", chat_key: key },
      {
        received: data => {
          if (this.state.username == data.username) {
            this.setState({
              chats: [
                ...this.state.chats,
                {
                  username: data.username,
                  content: data.content,
                  messagescore: data.messagescore
                }
              ],
              my_sentiment: data.my_sentiment_this_chat,
              my_sentiment_overall: data.my_sentiment_overall
            });
          } else {
            this.setState({
              chats: [
                ...this.state.chats,
                {
                  username: data.username,
                  content: data.content,
                  messagescore: data.messagescore
                }
              ],
              friend_sentiment: data.my_sentiment_this_chat,
              friend_sentiment_overall: data.my_sentiment_overall,
              word_count: data.word_count
            });
          }
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
      .then(response => {
        let messages = response.chat_messages;
        let chat_id = response.chat_id;
        this.setState({
          chat_key: chat_id,
          chats: messages,
          friend_sentiment: response.friend_sentiment_this_chat,
          my_sentiment: response.my_sentiment_this_chat,
          friend_sentiment_overall: response.friend_sentiment_overall,
          my_sentiment_overall: response.my_sentiment_overall,
          word_count: response.word_count
        });
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
    this.clearChart();
    this.getChat(nextProps.id, nextProps.current_chat);
    this.scrollToBot();
    this.state.channelCable.unsubscribe();
  }

  componentDidUpdate() {
    this.scrollToBot();
  }

  scrollToBot() {
    ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(
      this.refs.chats
    ).scrollHeight;
  }

  toggleChart = () => {
    this.setState({
      chart: !this.state.chart
    });
  };

  clearChart = () => {
    this.setState({
      chart: false
    });
  };

  submitMessage = e => {
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
  };

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
      <div>
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

        <Stats
          current_chat={this.props.current_chat}
          friend_sentiment={this.state.friend_sentiment}
          my_sentiment={this.state.my_sentiment}
          friend_sentiment_overall={this.state.friend_sentiment_overall}
          my_sentiment_overall={this.state.my_sentiment_overall}
          toggleChart={this.toggleChart}
          chart={this.state.chart}
          word_count={this.state.word_count}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.currentUser.username,
  id: state.auth.currentUser.id
});

export default connect(mapStateToProps, actions)(Chatroom);
