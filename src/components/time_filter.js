/*
	Filters by time
	Options range from 8am-2am
	Granular in 2-hour increments
*/

import React from 'react';
require('rc-slider/assets/index.css');
import Rcslider from 'rc-slider';

var TIMES_DATA = {0: 8, 1: 10, 2: 12, 3: 14, 4: 16, 5: 18, 6: 20, 7: 22, 8: 0, 9: 2};
var TIMES_DATA_DISPLAY = {0: "8am", 1: "10am", 2: "noon", 3: "2pm", 4: "4pm", 5: "6pm", 6: "8pm", 7: "10pm", 8: "midnight", 9: "2am"};

function log(value) {
  console.log(value);
}

const TimeFilter = (props) => {
  return (
    <Rcslider marks={TIMES_DATA_DISPLAY} min={0} max={9} allowCross={false} range dots step={1} defaultValue={[0, 2]} onAfterChange={props.onTimeChange} />
  );
};

export default TimeFilter;
