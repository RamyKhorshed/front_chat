import React, { Component } from "react";
import { connect } from "react-redux";
import Chatroom from "./Chatroom";
import * as actions from "./actions";
import { Container, Button, Segment, List } from "semantic-ui-react";
import withAuth from "./hocs/withAuth";

class Chatlist extends Component {
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
    fetch("http://localhost:3000/api/v1/users/" + id)
      .then(res => res.json())
      .then(res => this.setState({ chats: res.chats, users: res.users }));
  }

  goToUser = e => {
    this.setState({ current_chat: e.target.value });
  };

  render() {
    let usersFiltered = this.state.users.filter(
      user => user.username !== this.state.username
    );
    const allUsers = usersFiltered.map(user => (
      <List.Item>
        <Button fluid onClick={e => this.goToUser(e)} value={user.username}>
          {user.username}
        </Button>
      </List.Item>
    ));

    return (
      <Container fluid>
        <div className="chat-title">
          <h2>Welcome, {this.props.username}!</h2>
          <div className="chatlist">
            <List divided verticalAlign="middle">
              {allUsers}
            </List>
          </div>
        </div>
        <div className="right-display">
          {this.state.current_chat ? (
            <Chatroom current_chat={this.state.current_chat} />
          ) : null}
        </div>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: !!state.auth.currentUser.id,
  username: state.auth.currentUser.username,
  id: state.auth.currentUser.id
});

export default withAuth(connect(mapStateToProps, actions)(Chatlist));
