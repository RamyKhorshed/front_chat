import React, { Component } from "react";
import { Input, Grid } from "semantic-ui-react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./actions";

class NewUser extends Component {
  constructor() {
    super();
    this.state = {
      error: false,
      fields: {
        username: "",
        password: "",
        first_name: "",
        last_name: ""
      }
    };
  }

  handleChange = e => {
    const newFields = { ...this.state.fields, [e.target.name]: e.target.value };
    this.setState({ fields: newFields });
  };

  handleSubmit = e => {
    e.preventDefault();
    let data = {
      username: this.state.fields.username,
      password: this.state.fields.password,
      first_name: this.state.fields.first_name,
      last_name: this.state.fields.last_name
    };
    this.postNewUser(data).then(res => {
      if (!res.error) {
        const { fields: { username, password } } = this.state;
        this.props.loginUser(username, password, this.props.history);
      } else {
        this.setState({ error: true });
      }
    });
  };

  postNewUser = newSnippet => {
    let URL = "http://localhost:3000/api/v1/users/";
    return fetch(URL, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newSnippet)
    }).then(res => res.json());
  };

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100%" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <div className="ui segment">
            <form className="ui form" onSubmit={this.handleSubmit}>
              <div className="field">
                <label>Username</label>
                <Input
                  type="text"
                  fluid="false"
                  size="medium"
                  name="username"
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label>First Name</label>
                <Input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={this.state.first_name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label>Last Name</label>
                <Input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={this.state.last_name}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label>Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </div>
              <div className="field">
                <label>Re-Type Password</label>
                <Input
                  type="password"
                  placeholder="Password"
                  onChange={this.handleChange}
                />
              </div>
              <button className="ui big green basic button" type="submit">
                Create New User
              </button>
            </form>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default withRouter(connect(null, actions)(NewUser));
