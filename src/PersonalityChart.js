import React, { Component } from "react";
import { Radar } from "react-chartjs-2";
import { Header } from "semantic-ui-react";

class PersonalityChart extends Component {
  constructor() {
    super();

    this.state = {
      chartData: {},
      options: {}
    };
  }

  componentDidMount() {
    this.analyze();
  }

  analyze = () => {
    let current_chat = this.props.current_chat;
    let url = "http://localhost:3000/api/v1/watson_insights/" + current_chat;
    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => this.setChartData(res.personality_insights.personality));
  };

  setChartData = res => {
    const data = {
      labels: [
        "Openness",
        "Conscientiousness",
        "Extraversion",
        "Agreeableness",
        "Neuroticism"
      ],
      datasets: [
        {
          label: "Your Big5 Personality Traits",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: [
            res[0].raw_score,
            res[1].raw_score,
            res[2].raw_score,
            res[3].raw_score,
            res[4].raw_score
          ]
        }
      ]
    };

    this.setState({
      chartData: data
    });
  };

  render() {
    return (
      <div>
        <Header as="h3">
          <Header.Content>Your Personality Traits</Header.Content>
        </Header>
        <Radar data={this.state.chartData} />
      </div>
    );
  }
}

export default PersonalityChart;
