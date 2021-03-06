// add_event_page_4.js
import React, { Component } from 'react';
import Select from 'react-select';
import RaisedButton from 'material-ui/RaisedButton';


class AddEventPage4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null,
    };
    this.hiddenErrorMessage = <div className="hidden" />;
    this.visibleErrorMessages = (
      <div className="error-msg"> One category is required. </div>
    );
    // this.validNext = 'nxt-btn add-event-btn';
    // this.invalidNext = 'invalid-nxt-btn add-event-btn nxt-btn';
  }

  handleBack = (event) => {
    const data = {
      categories: this.state.categories,
      currentPage: this.props.currentPage - 1,
    };
    this.props.handleData(data);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.categories) {
      const data = {
        categories: this.state.categories,
        currentPage: this.props.currentPage + 1,
      };
      this.props.handleData(data);
    }
  }
  render() {
    let categoryErrorMessage = this.hiddenErrorMessage;
    if (this.state.categories === []) {
      categoryErrorMessage = this.visibleErrorMessages[0];
    }
    const dropdownValues = this.props.catList || [];
    return (
      <form className="add-event-form" onSubmit={this.handleSubmit}>
        <div className="add-event-fields">
          {categoryErrorMessage}
          <br />
          Select event categories
          <br />
          <Select multi joinValues
            options={dropdownValues}
            value={this.state.categories}
            onChange={categories => this.setState({ categories })}
          />
        </div>
        <div className="add-event-btns">
          <RaisedButton
            label="Back"
            type="button"
            onClick={(e) => { this.handleBack(e); }}
            className="back-btn"
          />
          <RaisedButton
            label="Next"
            primary
            type="submit"
            disabled={(!this.state.categories)}
            className="nxt-btn"
          />
        </div>
      </form>
    );
  }
}

export default AddEventPage4;
