import React from "react";
import { Tab } from "semantic-ui-react";
import { Radar } from "react-chartjs-2";

const Homepage = props => (
  <div className="containers">
    <section id="banner">
      <img src="./images/chat.png" />
      <h2>This is Chatalyzer</h2>
      <p>More Understanding, Better Communication</p>
      <ul className="actions">
        <li>
          <a href="/Login" className="button big">
            Get Started
          </a>
        </li>
      </ul>
    </section>
  </div>
);

export default Homepage;
