import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login";
import Chatroom from "./Chatroom";
import * as actions from "./actions";
import { Input, Menu, Button, Segment } from "semantic-ui-react";
import withAuth from "./hocs/withAuth";

class Chatlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: this.props.username,
      current_chat: "",
      id: this.props.id,
      chats: [],
      users: []
    };
  }

  componentDidMount() {
    let id = this.state.id;
    fetch("http://localhost:3000/api/v1/users/{id}")
      .then(res => res.json())
      .then(res => this.setState({ chats: res.chats, users: res.users }))
      .then(res => console.log(this.state));
  }

  goToUser = e => {
    this.setState({ current_chat: e.target.value });
  };

  render() {
    let usersFiltered = this.state.users.filter(
      user => user.username !== this.state.username
    );
    const allUsers = usersFiltered.map(user => (
      <Button onClick={e => this.goToUser(e)} value={user.username}>
        {user.username}
      </Button>
    ));

    const existingChats = this.state.chats.map(chat => (
      <Button onClick={e => this.goToChat(e)} value={chat.name}>
        {chat.name}
      </Button>
    ));

    return (
      <div>
        <Segment>
          <h1>Start a chat with a User from the list below:</h1>
          {allUsers}
          {/* <h1>Or Continue an existing Chat:</h1>
          {existingChats} */}
        </Segment>
        {this.state.current_chat ? (
          <div>
            <Chatroom current_chat={this.state.current_chat} />
          </div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  username: state.auth.currentUser.username,
  id: state.auth.currentUser.id
});

export default connect(mapStateToProps, actions)(Chatlist);
