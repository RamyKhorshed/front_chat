import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import Login from "./Login";
import Chatlist from "./Chatlist";
import * as actions from "./actions";
import { Menu, Button } from "semantic-ui-react";
import NewUser from "./NewUser";
import Homepage from "./Homepage";

class App extends Component {
  render() {
    return (
      <div className="container">
        <Menu className="menu">
          <Menu.Item>
            <Link to={"/"}>
              <img
                src="./images/chat.png"
                style={{
                  width: "30px",
                  height: "30px",
                  display: "inline-block"
                }}
              />
            </Link>

            <h1>Chatalyzer</h1>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <a href="/Login">Interpreting Results</a>
            </Menu.Item>

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
                <Link to="/login">Go to Login</Link>
              )}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route path="/login" component={Login} />
            <Route path="/Results" component={Login} />
            <Route path="/chatroom" component={Chatlist} />
            <Route
              path="/user/new"
              render={props => <NewUser {...props} handleLogin={this.login} />}
            />
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
