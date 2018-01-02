import React, { Component } from "react";
import { Radar } from "react-chartjs-2";
import { Header } from "semantic-ui-react";

import Tabs from "./Tabs.js";

class PersonalityChart extends Component {
  constructor() {
    super();

    this.state = {
      chartData: {},
      valueData: {},
      needsData: {},
      options: {},
      fullData: {}
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
      .then(res => this.setChartData(res));
  };

  setChartData = res => {
    let personality = res.personality_insights.personality;
    let values = res.personality_insights.values;
    let needs = res.personality_insights.needs;

    const personalityData = {
      labels: [
        personality[0].name,
        personality[1].name,
        personality[2].name,
        personality[3].name,
        personality[4].name
      ],
      datasets: [
        {
          label: "Personality Traits",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: [
            personality[0].percentile,
            personality[1].percentile,
            personality[2].percentile,
            personality[3].percentile,
            personality[4].percentile
          ]
        }
      ]
    };

    const valueData = {
      labels: [
        values[0].name,
        values[1].name,
        values[2].name,
        values[3].name,
        values[4].name
      ],
      datasets: [
        {
          label: "Values",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: [
            values[0].percentile,
            values[1].percentile,
            values[2].percentile,
            values[3].percentile,
            values[4].percentile
          ]
        }
      ]
    };

    const needsData = {
      labels: [
        needs[0].name,
        needs[1].name,
        needs[2].name,
        needs[3].name,
        needs[4].name,
        needs[5].name,
        needs[6].name,
        needs[7].name,
        needs[8].name,
        needs[9].name,
        needs[10].name,
        needs[11].name
      ],
      datasets: [
        {
          label: "Needs",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          data: [
            needs[0].percentile,
            needs[1].percentile,
            needs[2].percentile,
            needs[3].percentile,
            needs[4].percentile,
            needs[5].percentile,
            needs[6].percentile,
            needs[7].percentile,
            needs[8].percentile,
            needs[9].percentile,
            needs[10].percentile,
            needs[11].percentile
          ]
        }
      ]
    };

    console.log(res);

    this.setState({
      chartData: personalityData,
      valueData,
      needsData,
      fullData: res.personality_insights
    });
  };

  render() {
    return (
      <Tabs
        data={this.state.chartData}
        valueData={this.state.valueData}
        needsData={this.state.needsData}
      />
    );
  }
}

export default PersonalityChart;
