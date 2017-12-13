import React, { Component } from "react";
import ActionCable from "actioncable";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.subscribeChannel();
  }

  subscribeChannel() {
    const cable = ActionCable.createConsumer("ws://localhost:3000/cable");
    cable.subscriptions.create("RoomChannel", {
      received: data => {
        console.log("Receiving Data:", data);
      }
    });
  }

  render() {
    return <div>Chat</div>;
  }
}

export default Chat;
