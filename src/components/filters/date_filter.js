/*
  Filters by date
  Based on the upcoming week or next 2 weeks
*/

import React, { Component } from 'react';

import { Popover, Checkbox, RaisedButton } from 'material-ui';

import { convertDatesToDisplay } from '../../helpers/date-data-helper';

// Display today and the next 6 days as filter options
// and an option for the next 2 weeks
const NUM_DAYS_DISPLAY = 8;

// Check the next 2 days by default
const DEFAULT_CHECKED = [true, true, false, false, false, false, false, false];
const DEFAULT_DATES = ['0', '1'];

// Array of dates with labels and values both set
// to the date
const DATES = [];


class DateFilter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checked: DEFAULT_DATES,
      checked_boolean: DEFAULT_CHECKED,
    };

     // receives the dates data object passed down from index.js
    this.datesData = this.props.dateBarData;
    if (this.datesData) {
      // dictionary of date strings to be displayed onscreen
      this.datesDataDisplay = convertDatesToDisplay(this.datesData);
    } else {
      this.datesDataDisplay = null;
    }

    for (let i = 0; i < NUM_DAYS_DISPLAY; i += 1) {
      if (this.datesDataDisplay[i] !== undefined) {
        DATES.push(this.datesDataDisplay[i]);
      }
    }
  }

  componentWillMount = () => {
    this.filterEvent(DEFAULT_DATES);
    this.selectedCheckboxes = new Set();
  }

  handleChange = (event) => {
    const val = event.target.value;
    let checked = this.state.checked.slice(); // copy
    let checkedBoolean = this.state.checked_boolean.slice();
    if (checked.includes(val)) {
      checked.splice(checked.indexOf(val), 1);
      checkedBoolean[val] = false;
      if ((checked.includes('7'))) {
        document.getElementById('d7').checked = false;
        checked.splice(checked.indexOf('7'), 1);
        checkedBoolean[7] = false;
      }
    } else {
      checked.push(val);
      checkedBoolean[val] = true;
      if (val === '7') {
        // check every box
        checked = ['0', '1', '2', '3', '4', '5', '6', '7'];
        checkedBoolean = [true, true, true, true, true, true, true, true];
      }
    }
    this.setState({ checked, checked_boolean: checkedBoolean });
    this.filterEvent(checked);
  }

  filterEvent = (checked) => {
    const dateArray = [];
    // convert checked strings to ints and add them to dateArray (sorted)
    let c, n;
    for (c in checked) {
      if (checked[c]) {
        n = parseInt(checked[c], 10);
        dateArray.push(n);
      }
    }
    dateArray.sort();
    this.props.onDateChange(dateArray);
  }

  render() {
    if (this.datesDataDisplay === null) {
      return <div className="hidden" />;
    } else if (!this.props.openDateFilter) {
      return (
        <div className="filter">
          <div className="multiselect">
            <RaisedButton className="block"
              primary
              style={this.props.styles.buttonStyle}
              onTouchTap={this.props.openFilter}
              label="Filter by Date"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="filter">
        <div className="multiselect">
          <RaisedButton className="block" secondary
            style={this.props.styles.buttonStyle}
            onTouchTap={this.props.openFilter}
            label="Filter by Date"
          />
        </div>
        <Popover className="checkbox"
          open={this.props.openDateFilter}
          anchorEl={this.props.anchorEl}
          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
          onRequestClose={this.props.openFilter}
          style={this.props.styles.checkboxStyle}
        >
          <Checkbox
            label={DATES[0]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[0]}
            value="0"
            id="d0"
          />
          <Checkbox
            label={DATES[1]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[1]}
            value="1"
            id="d1"
          />
          <Checkbox
            label={DATES[2]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[2]}
            value="2"
            id="d2"
          />
          <Checkbox
            label={DATES[3]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[3]}
            value="3"
            id="d3"
          />
          <Checkbox
            label={DATES[4]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[4]}
            value="4"
            id="d4"
          />
          <Checkbox
            label={DATES[5]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[5]}
            value="5"
            id="d5"
          />
          <Checkbox
            label={DATES[6]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[6]}
            value="6"
            id="d6"
          />
          <Checkbox
            label={DATES[7]}
            onCheck={this.handleChange}
            checked={this.state.checked_boolean[7]}
            value="7"
            id="d7"
          />
        </Popover>
      </div>

    );
  }
}

export default DateFilter;
