import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import * as actions from "./actions";
import {
  Segment,
  Progress,
  Statistic,
  Button,
  Divider
} from "semantic-ui-react";
import "./App.css";

import PersonalityChart from "./PersonalityChart.js";
import Analyze from "./Analyze.js";

class Stats extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="stats">
        <Segment>
          <Divider horizontal>
            <h2>Watson Personality Insights</h2>
          </Divider>
          {this.props.chart ? (
            <PersonalityChart current_chat={this.props.current_chat} />
          ) : (
            <Analyze
              toggleChart={this.props.toggleChart}
              word_count={this.props.word_count}
            />
          )}

          <Divider horizontal>
            <h2>{this.props.current_chat}'s Sentiment:</h2>
          </Divider>
          <ul>
            <li>
              This Conversation:
              <Progress
                percent={this.props.friend_sentiment * 100}
                indicating
                size="small"
              />
            </li>
            <li>
              Overall:
              <Progress
                percent={this.props.friend_sentiment_overall * 100}
                indicating
                size="small"
              />
            </li>
            <li>
              <Statistic
                color={
                  this.props.friend_sentiment >
                  this.props.friend_sentiment_overall
                    ? "green"
                    : "red"
                }
              >
                <Statistic.Value>
                  {(
                    (this.props.friend_sentiment -
                      this.props.friend_sentiment_overall) *
                    10
                  ).toFixed(2)}
                </Statistic.Value>
                <Statistic.Label>Conversation Score</Statistic.Label>
              </Statistic>
            </li>
          </ul>

          <Divider horizontal>
            <h2>Your Sentiment:</h2>
          </Divider>
          <ul>
            <li>
              This Conversation:
              <Progress
                percent={this.props.my_sentiment * 100}
                indicating
                size="small"
              />
            </li>
            <li>
              Overall:
              <Progress
                percent={this.props.my_sentiment_overall * 100}
                indicating
                size="small"
              />
            </li>
            <li>
              <Statistic
                color={
                  this.props.my_sentiment > this.props.my_sentiment_overall
                    ? "green"
                    : "red"
                }
              >
                <Statistic.Value>
                  {(
                    (this.props.my_sentiment -
                      this.props.my_sentiment_overall) *
                    10
                  ).toFixed(2)}
                </Statistic.Value>
                <Statistic.Label>Conversation Score</Statistic.Label>
              </Statistic>
            </li>
          </ul>
        </Segment>
      </div>
    );
  }
}

export default connect(null, actions)(Stats);