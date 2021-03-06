// add_event_dialog.js

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';

import AddEventPage1 from './add_events/add_event_page_1';
import AddEventPage2 from './add_events/add_event_page_2';
import AddEventPage3 from './add_events/add_event_page_3';
import AddEventPage4 from './add_events/add_event_page_4';
import AddEventPage5 from './add_events/add_event_page_5';
// import AddEventSubmitPage from './add_events/add_event_submit_page';

import PageSlider from './add_events/add_event_page_slider';

// import the redux actions
import { createEvent } from '../actions';

class AddEventDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: null,
      organizer: null,
      description: null,
      date: null,
      start_time: null,
      end_time: null,
      location: null,
      location_string: null,
      categories: null,
      icon: null,
      currentPage: 0,
      image_url: ['https://s23.postimg.org/mh7ui2tqj/no_image.png'],
    };
  }

  resetState = () => {
    this.setState({
      name: null,
      organizer: null,
      description: null,
      date: null,
      start_time: null,
      end_time: null,
      location: null,
      location_string: null,
      categories: [],
      icon: null,
      currentPage: 0,
      image_url: ['https://s23.postimg.org/mh7ui2tqj/no_image.png'],
    });
  }

  handlePageData = (data) => {
    if (data.currentPage === this.pageCode.length) {
      this.setState(data, this.submitEventData);
    } else {
      this.setState(data);
    }
  }
  submitEventData = () => {
    console.log(this.props.jwt);
    const data = {
      name: this.state.name,
      organizer: this.state.organizer,
      description: this.state.description,
      date: this.state.date,
      start_time: this.state.start_time,
      end_time: this.state.end_time,
      location: this.state.location,
      location_string: this.state.location_string,
      icon_url: this.state.icon.url,
      categories: this.state.categories,
      image_url: this.state.image_url,
    };
    this.resetState();
    this.props.createEvent(data, this.props.jwt);
    this.props.handleAddEventData();
  }
  handleClose = () => {
    this.resetState();
    this.props.closeAddEventDialog();
  }
  render() {
    const page1Data = { name: this.state.name, organizer: this.state.organizer, description: this.state.description, location_string: this.state.location_string };
    const page2Data = { date: this.state.date, start_time: this.state.start_time, end_time: this.state.end_time };
    const page3Data = { location: this.state.location };
    const page4Data = { categories: this.state.categories };
    const page5Data = { icon: this.state.icon, image_url: this.state.image_url };
    this.pageCode = [
      <AddEventPage1 currentPage={this.state.currentPage} data={page1Data} handleData={this.handlePageData} />,
      <AddEventPage2 currentPage={this.state.currentPage} data={page2Data} handleData={this.handlePageData} />,
      <AddEventPage3 currentPage={this.state.currentPage} data={page3Data} handleData={this.handlePageData} />,
      <AddEventPage4 currentPage={this.state.currentPage} catList={this.props.catList} data={page4Data} handleData={this.handlePageData} />,
      <AddEventPage5 currentPage={this.state.currentPage} data={page5Data} handleData={this.handlePageData} submitEventData={this.submitEventData} />,
    ];

    if (this.props.addEvent) {
      return (
        <div>
          <Dialog
            className="add-event-cover"
            title="Add new event"
            modal={false}
            autoScrollBodyContent
            open={this.props.addEvent}
            onRequestClose={this.handleClose}
            titleStyle={{ borderBottom: 0 }}
          >
            <PageSlider currentPage={this.state.currentPage} numPages={this.pageCode.length - 1} />
            {this.pageCode[this.state.currentPage]}
          </Dialog>
        </div>
      );
    }
    return (
      <div className="hidden">This is the hidden add Event Dialog</div>
    );
  }
}

const mapStateToProps = state => (
  {
    catList: state.events.catList,
    jwt: state.user.jwt,
  }
);

export default connect(mapStateToProps, { createEvent })(AddEventDialog);
