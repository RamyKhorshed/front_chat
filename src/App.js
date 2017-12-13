import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Chatroom from "./Chatroom";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Chatroom />
      </div>
    );
  }
}

export default App;
