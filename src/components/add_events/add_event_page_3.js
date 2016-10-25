// add_event_page_3.js
import React, { Component } from 'react';

class AddEventPage3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      location_string: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.hiddenErrorMessage = <div className="hidden" />;
    this.visibleErrorMessages = ['location', 'room'].map((data) => {
      return <div key={data} className="errorMessage"> The {data} of the event is required. </div>;
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    if (this.state.location && this.state.location_string) {
      this.props.handleData(this.state);
    }
  }
  render() {
    const locationErrorMessage = (this.state.location === '') ? this.visibleErrorMessages[0] : this.hiddenErrorMessage;
    const roomErrorMessage = (this.state.location_string === '') ? this.visibleErrorMessages[1] : this.hiddenErrorMessage;
    return (
      <form className="addEventForm" onSubmit={this.handleSubmit}>
        <h2>Location of Event:* </h2>
        <select
          value={this.state.location || ''}
          onChange={event => this.setState({ location: event.target.value })}
          className={(this.state.location !== '' && this.state.location !== 'select-one') ? 'addEventBox' : 'formBoxError'}
        >
          <option value="select-one">Select an option</option>
          <option value="collis">Collis</option>
          <option value="foco">Foco</option>
        </select>
        {locationErrorMessage}
        <h2>Room:*</h2>
        <input
          type="text"
          placeholder="e.g. Collis 112"
          value={this.state.location_string || ''}
          onChange={event => this.setState({ location_string: event.target.value })}
          className={(this.state.location_string !== '') ? 'addEventBox' : 'formBoxError'}
        />
        {roomErrorMessage}
        <input
          type="submit"
          value="Next"
          className={(!this.state.location || !this.state.location_string) ? 'invalidNextBtn' : 'validNextBtn'}
        />
      </form>
    );
  }
}

export default AddEventPage3;