// user_page.js

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Tabs, Tab, Menu, MenuItem, Card, Avatar, Drawer } from 'material-ui';
import { zIndex } from 'material-ui/styles';
import CancelNavigation from 'material-ui/svg-icons/navigation/cancel';

// import the redux actions
import { fetchRSVPdEventsById, fetchUserEventsById, logout } from '../actions';

import UserEventList from './user_profile_event_list';
import { sortDateTimeReverse } from '../helpers/date-time-filters-helper';

class UserPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      uploadingPhoto: false,
    };
    this.sortEventList = this.sortEventList.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.user !== this.props.user) {
      this.getSubmittedEvents();
      this.getRSVPEvents();
    }
  }

  onEventListItemClick = (eventId) => {
    console.log('Button clicked ', eventId);
  }

  getRSVPEvents = () => {
    if (this.props.user.userInfo && this.props.user.userInfo.constructor === Array) {
      const arr = eval(this.props.user.userInfo[0].rsvpevents);
      const idString = arr.toString();
      this.props.fetchRSVPdEventsById(idString);
    }
  }

  getSubmittedEvents = () => {
    if (this.props.user.userInfo && this.props.user.userInfo.constructor === Array) {
      const arr = eval(this.props.user.userInfo[0].createdevents);
      const idString = arr.toString();
      this.props.fetchUserEventsById(idString);
    }
  }

  logout() {
    this.props.logout();
    window.location.replace('../');
  }

  sortEventList(eventList) {
    if (eventList) {
      return eventList.sort(sortDateTimeReverse);
    } else {
      return eventList;
    }
  }

  render() {
    if (this.props.RSVPEvents == null) {
      this.getRSVPEvents();
      return null;
    }

    if (this.props.SubmittedEvents == null) {
      this.getSubmittedEvents();
      return null;
    }

    return (
      <div>
        <Tabs style={{ marginLeft: '28%', position: 'static', top: 0, width: '72%', marginTop: '60px', zIndex: 1500 }}>
          <Tab label="Submitted Events" href="#SubmitEvents">
            <div className="user-event-list">
              <h1>Your Submitted Events</h1>
              <UserEventList
                events={this.sortEventList(this.props.SubmittedEvents)}
                onEventListItemClick={this.onEventListItemClick}
              />
            </div>
          </Tab>
          <Tab label="RSVP'ed Events" href="#RSVPEvents">
            <div className="user-event-list">
              <h1>Your RSVP Events</h1>
              <UserEventList
                events={this.sortEventList(this.props.RSVPEvents)}
                onEventListItemClick={this.onEventListItemClick}
              />
            </div>
          </Tab>
        </Tabs>
        <Drawer
          docked
          open
          containerStyle={{ zIndex: zIndex.drawer - 100, width: '28%', marginTop: '60px' }}
        >
          <Card style={{ paddingBottom: '25px' }}>
            <Avatar size={25} className="img-responsive center-block" style={{ minWidth: '0%', width: '150px', height: '150px', marginLeft: '125px', marginTop: '25px' }}
              src={this.props.user.fbProfPicUrl} alt="avatar"
            />
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#5a7391', fontSize: '25px', fontWeight: 600, marginBottom: '7px' }} >{this.props.user.userInfo[0].name}</p>
          </Card>
          <Menu>
            <MenuItem primaryText="Logout" leftIcon={<CancelNavigation />} onTouchTap={this.logout} />
          </Menu>
        </Drawer>
      </div>
    );
  }
}

const mapDispatchToProps = { logout, fetchRSVPdEventsById, fetchUserEventsById };

const mapStateToProps = state => (
  {
    user: state.user,
    RSVPEvents: state.events.rsvps,
    SubmittedEvents: state.events.userEvents,
  }
);

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
