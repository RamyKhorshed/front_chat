import React from "react";
import { Progress, Button } from "semantic-ui-react";

const Analyze = props =>
  props.word_count > 100 ? (
    <Button onClick={props.toggleChart}>Analyze</Button>
  ) : (
    <div>
      <Progress percent={props.word_count} indicating size="small" />
      <p>{100 - props.word_count} more words needed to run analysis </p>
    </div>
  );

export default Analyze;
