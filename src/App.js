import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login";
import Chatlist from "./Chatlist";
import * as actions from "./actions";
import { Menu, Button } from "semantic-ui-react";

class App extends Component {
  render() {
    return (
      <div>
        <Menu>
          <Menu.Item>
            <h1>Welcome to Gravim8</h1>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              {this.props.loggedIn ? (
                <a
                  onClick={e => {
                    e.preventDefault();
                    this.props.logoutUser();
                  }}
                >
                  Sign Out
                </a>
              ) : (
                <Link to="/login">
                  <Button>Go to Login</Button>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {this.props.loggedIn ? (
                <Link to={"/chatroom"}>
                  <Button>Go to Chat</Button>
                </Link>
              ) : null}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div className="App">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path={"/chatroom"} component={Chatlist} />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: !!state.auth.currentUser.id,
  username: state.auth.currentUser.username
});

export default connect(mapStateToProps, actions)(App);
