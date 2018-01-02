import React from "react";
import { Tab } from "semantic-ui-react";
import { Radar } from "react-chartjs-2";
import PersonalityChart from "./PersonalityChart.js";

const panes = [
  {
    menuItem: "Big 5",
    render: props => (
      <Tab.Pane attached={false}>
        <Radar data={props.data} />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Values",
    render: props => (
      <Tab.Pane attached={false}>
        <Radar data={props.valueData} />
      </Tab.Pane>
    )
  },
  {
    menuItem: "Needs",
    render: props => (
      <Tab.Pane attached={false}>
        <Radar data={props.needsData} />
      </Tab.Pane>
    )
  }
];

const Tabs = props => (
  <Tab
    data={props.data}
    valueData={props.valueData}
    needsData={props.needsData}
    menu={{ secondary: true, pointing: true }}
    panes={panes}
  />
);

export default Tabs;
