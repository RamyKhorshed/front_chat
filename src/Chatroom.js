import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as actions from "./actions";
import { Grid, Segment, Progress, Statistic, Button } from "semantic-ui-react";
import "./App.css";
import ActionCable from "actioncable";

import Message from "./Message.js";

class Chatroom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: this.props.username,
      chat_key: 1,
      chats: [],
      channelCable: {},
      friend_sentiment: 0,
      friend_sentiment: 0,
      my_sentiment: 0,
      friend_sentiment_overall: 0,
      my_sentiment_overall: 0
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
              friend_sentiment_overall: data.my_sentiment_overall
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
          my_sentiment_overall: response.my_sentiment_overall
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

  analyze = () => {
    let current_chat = this.props.current_chat;
    let id = this.props.id;
    let url = "http://localhost:3000/api/v1/watson_insights/" + current_chat;
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
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
      <Grid.Row>
        <Grid.Column width={8}>
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
        </Grid.Column>
        <Grid.Column width={6}>
          <Segment>
            <h1>Statistics</h1>
            <h2>{this.props.current_chat}'s Sentiment:</h2>
            <ul>
              <li>
                This Conversation:
                <Progress
                  percent={this.state.friend_sentiment * 100}
                  indicating
                />
              </li>
              <li>
                Overall:
                <Progress
                  percent={this.state.friend_sentiment_overall * 100}
                  indicating
                />
              </li>
              <li>
                <Statistic
                  color={
                    this.state.friend_sentiment >
                    this.state.friend_sentiment_overall
                      ? "green"
                      : "red"
                  }
                >
                  <Statistic.Value>
                    {(
                      (this.state.friend_sentiment -
                        this.state.friend_sentiment_overall) *
                      10
                    ).toFixed(2)}
                  </Statistic.Value>
                  <Statistic.Label>Conversation Score</Statistic.Label>
                </Statistic>
              </li>
            </ul>
            <h2>{username}'s Sentiment:</h2>
            <ul>
              <li>
                This Conversation:
                <Progress percent={this.state.my_sentiment * 100} indicating />
              </li>
              <li>
                Overall:
                <Progress
                  percent={this.state.my_sentiment_overall * 100}
                  indicating
                />
              </li>
              <li>
                <Statistic
                  color={
                    this.state.my_sentiment > this.state.my_sentiment_overall
                      ? "green"
                      : "red"
                  }
                >
                  <Statistic.Value>
                    {(
                      (this.state.my_sentiment -
                        this.state.my_sentiment_overall) *
                      10
                    ).toFixed(2)}
                  </Statistic.Value>
                  <Statistic.Label>Conversation Score</Statistic.Label>
                </Statistic>
              </li>
            </ul>
          </Segment>
          <Button onClick={this.analyze}>Analyze</Button>
        </Grid.Column>
      </Grid.Row>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.currentUser.username,
  id: state.auth.currentUser.id
});

export default connect(mapStateToProps, actions)(Chatroom);
