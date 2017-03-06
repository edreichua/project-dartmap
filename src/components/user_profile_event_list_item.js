// event_list_item.js
import React, { Component } from 'react';
import DateTime from 'react-datetime';
import Select from 'react-select';
import moment from 'moment';

import { TimePicker, DatePicker, TextField, SelectField, MenuItem, ListItem, FlatButton } from 'material-ui';

import { deleteEvent, updateEvent } from '../helpers/dartmap-api';

// import helper functions
import {
  createMap, createMarker, createInfoWindow, loadGoogleApi,
} from '../helpers/google-maps';

const CATEGORIES = [
  { label: 'Academic', value: 'Academic' },
  { label: 'Art', value: 'Art' },
  { label: 'Sports', value: 'Sports' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Lecture', value: 'Lecture' },
  { label: 'Greek Life', value: 'Greek Life' },
  { label: 'Free Food', value: 'Free Food' },
];

class UserEventListItem extends Component {
  constructor(props) {
    super(props);
    this.selectedCategories = [];
    for (let i = 0; i < this.props.event.categories.length; i += 1) {
      const cat = this.props.event.categories[i];
      const catLabel = cat.name;
      const catValue = cat.name;
      this.selectedCategories.push({ label: catLabel, value: catValue });
    }
    let catString = '';
    for (let i = 0; i < this.props.event.categories.length; i += 1) {
      if (i !== 0) {
        catString += ', ' + this.props.event.categories[i].name;
      } else {
        catString += this.props.event.categories[i].name;
      }
    }
    this.state = {
      editing: false,
      editEventButtonText: 'Edit',
      // selectedMarker: null,
      eventName: this.props.event.name,
      eventOrganizer: this.props.event.organizer,
      eventDescription: this.props.event.description,
      eventStartTime: this.props.event.start_time.toDate(),
      eventEndTime: this.props.event.end_time.toDate(),
      eventLocation: this.props.event.location_name,
      eventCategories: this.selectedCategories,
      eventCategoriesString: catString,
      eventLocationLng: this.props.event.lng,
      eventLocationLat: this.props.event.lat,
      eventLocationName: this.props.event.location_name,
      eventIconUrl: this.props.event.icon_url,
    };
    this.map = null;
    this.marker = null;
    // this.editMap = null;
    // this.gPlaces = null;
    // this.gMaps = this.gMaps || (window.google && window.google.maps);
    // this.infoWindow = null;
    // this.editMarker = null;
    // this.editMarkers = [];
    // this.infoWindow = null;
    this.confirmDelete = this.confirmDelete.bind(this);
    this.editingEvent = this.editingEvent.bind(this);
    this.isValidTime = this.isValidTime.bind(this);
    this.handleCategChange = this.handleCategChange.bind(this);
    if (!window.google) { // Load google maps api onto the page
      loadGoogleApi();
    }
    this.loadMap = this.loadMap.bind(this);
    // this.loadEditMap = this.loadEditMap.bind(this);
  }

  componentDidMount() {
    if (window.google && this.props.event && !this.map) {
      this.loadMap();
    }
  }

  componentDidUpdate() {
    if (window.google && this.props.event && !this.map) {
      this.loadMap();
    }
  }

  confirmDelete() {
    const r = confirm('Are you sure you want to delete this event?');
    if (r === true) {
      deleteEvent(this.props.event.id);
    }
  }

  editingEvent() {
    console.log('this.state');
    console.log(this.state);
    if (this.state.editing === true) {
      this.setState({
        editing: false,
        editEventButtonText: 'Edit',
      });
      const toSend = {};
      toSend.name = this.state.eventName;
      toSend.organizer = this.state.eventOrganizer;
      toSend.description = this.state.eventDescription;
      toSend.start_time = moment(this.state.eventStartTime)._i;
      toSend.end_time = moment(this.state.eventEndTime)._i;
      toSend.location_name = this.state.eventLocation;
      // format the categories to send
      let catsToSend = '';
      for (let i = 0; i < this.state.eventCategories.length; i += 1) {
        if (i !== 0) {
          catsToSend += ', ';
        }
        catsToSend += this.state.eventCategories[i].value;
        toSend.categories = catsToSend;
      }
      console.log('toSend:');
      console.log(toSend);
      updateEvent(this.props.event.id, toSend);
      // update string of categories
      this.setState({ eventCategoriesString: catsToSend });
      alert('Event updated!');
    } else {
      this.setState({
        editing: true,
        editEventButtonText: 'Save',
      });
      // this.loadEditMap();
    }
  }

  isValidTime() {
    if (!this.state.eventStartTime) {
      return true;
    }
    if (!this.state.eventEndTime) {
      return true;
    }
    // return (this.state.eventStartTime) && (this.state.eventEndTime) && this.state.eventEndTime.isAfter(this.state.eventStartTime);
    return (this.state.eventStartTime) && (this.state.eventEndTime) && (this.state.eventStartTime < this.state.eventEndTime);
  }

  // onCategoryChange(selectedCategories) {
  //   this.setState({ eventCategories: selectedCategories });
  // }

  handleCategChange(value) {
    this.setState({ value });
    const cats = value.split(',');
    console.log(cats.length);
    const obj = [];
    for (let i = 0; i < cats.length; ++i) {
      if (cats[i] != undefined) {
        const singleObj = {};
        let id;
        if (cats[i] === 'Academic') id = 1;
        if (cats[i] === 'Art') id = 2;
        if (cats[i] === 'Sports') id = 3;
        if (cats[i] === 'Performance') id = 4;
        if (cats[i] === 'Lecture') id = 5;
        if (cats[i] === 'Greek Life') id = 6;
        if (cats[i] === 'Free Food') id = 7;
        singleObj.id = id;
        singleObj.name = cats[i];
        obj.push(singleObj);
      }
    }
    this.setState({ eventCategories: obj });
  }

  loadMap() {
    if (!this.map) {
      const mapHTML = document.getElementById('uspg-map-'.concat(this.props.event.id));
      const location = {
        lng: this.state.eventLocationLng,
        lat: this.state.eventLocationLat,
      };
      const locationName = this.state.eventLocationName;
      const iconUrl = this.state.eventIconUrl;
      const mapOptions = {
        center: location,
        zoom: 15,
        fullscreenControl: false,
        mapTypeControl: false,
      };
      const icon = {
        url: iconUrl,
        anchor: {
          x: 15,
          y: 15,
        },
        scaledSize: {
          height: 30,
          width: 30,
        },
      };
      this.map = createMap(mapHTML, mapOptions);
      this.marker = createMarker(this.map, location, icon);
      this.infoWindow = createInfoWindow(this.map, this.marker, locationName);
    }
  }

  handleChangeTimeStart = (event, date) => {
    this.setState({ eventStartTime: date });
  };
  handleChangeTimeEnd = (event, date) => {
    this.setState({ eventEndTime: date });
  };

  render() {
    // this block of code builds the string to display the event's categories
    let categoriesStringLabel = 'Categor';
    if (this.props.event.categories.length === 1) {
      categoriesStringLabel += 'y:';
    } else {
      categoriesStringLabel += 'ies:';
    }

    let eventMap = null;
    let eventName = null;
    let eventTime = null;
    let eventLocation = null;
    let eventOrganizer = null;
    let eventCategories = null;
    let eventDescription = null;
    // if user is editing this event
    if (this.state.editing) {
      eventMap = (
        <div id={'uspg-map-'.concat(this.props.event.id)} className="uspg-map" />
        // <div className="add-event-fields">
          // <input
            // id="map-search-box"
            // type="text"
            // placeholder="Search for or select location"
            // value={(this.state.eventLocationLng && this.state.eventLocationName) || ''}
            // onChange={(event) => {
              // this.setState({ location: { name: event.target.value } });
            // }}
            // className="add-event-text add-event-loc-string"
          // />
          // <div id="add-event-map" />
        // </div>
      );
      eventName = (
        <TextField style={{ height: '33px' }}
          defaultValue={this.state.eventName}
          onChange={event => this.setState({ eventName: event.target.value })}
        />
      );
      eventTime = (
        <div>
          <text className="attributeTitle">
            <br />Start Time:&nbsp;
          </text>
          <TimePicker style={{ display: 'inline', height: '33px' }}
            defaultTime={this.state.eventStartTime}
            value={this.state.eventStartTime}
            onChange={this.handleChangeTimeStart}
          />
          <text className="attributeTitle">
            <br />End Time:&nbsp;
          </text>
          <TimePicker style={{ display: 'inline', height: '33px' }}
            defaultTime={this.state.eventEndTime}
            value={this.state.eventEndTime}
            onChange={this.handleChangeTimeEnd}
          />
        </div>
      );
      // eventLocation = (
      //   <button className="user-change-event-location" type="button" onClick={this.confirmDelete}>
      //     Change location (this will eventually be replaced by Location/Room name)
      //   </button>
      // );
      eventOrganizer = (
        <TextField style={{ height: '33px' }}
          defaultValue={this.state.eventOrganizer}
          onChange={event => this.setState({ eventOrganizer: event.target.value })}
        />
      );
      eventCategories = (
        <div className="row">
          <text className="attribute col-md-1">
            <br />{categoriesStringLabel}&nbsp;
          </text>
          <div className="col-md-7" style={{ left: '-8px' }}>
            <Select multi joinValues
              options={CATEGORIES}
              value={this.state.eventCategories}
              onChange={categories => this.setState({ eventCategories: categories })}
            />
          </div>
        </div>
      );
      eventDescription = (
        <TextField
          defaultValue={this.state.eventDescription}
          onChange={event => this.setState({ eventDescription: event.target.value })}
        />
      );
    } else {
      eventMap = (
        <div id={'uspg-map-'.concat(this.props.event.id)} className="uspg-map" />
      );
      eventName = (
        <h6 style={{ display: 'inline' }} className="name">
          {this.state.eventName}
        </h6>
      );
      eventTime = (
        <div>
          <text className="attributeTitle">
            <br />Time:&nbsp;
          </text>
          <text className="attribute">
            {moment(this.state.eventStartTime).format('h:mm A')} ~ {moment(this.state.eventEndTime).format('h:mm A')}<br />
          </text>
        </div>
      );
      eventLocation = (
        <div>
          <text className="attributeTitle">
            <br />Location:&nbsp;
          </text>
          <text className="attribute">
            {this.state.eventLocation}<br />
          </text>
        </div>
      );
      eventOrganizer = (
        <text className="attribute">
          {this.state.eventOrganizer}<br />
        </text>
      );
      eventCategories = (
        <div>
          <text className="attribute">
            <br />{categoriesStringLabel}&nbsp;
          </text>
          <text className="attribute">
            {this.state.eventCategoriesString}<br />
          </text>
        </div>
      );
      eventDescription = (
        <text className="attribute">
          {this.state.eventDescription}<br />
        </text>
      );
    }

    return (
      <ListItem>
        <div>
          {eventMap}
          <div>
            <text className="attributeTitle">
              <br />Event Name:&nbsp;
            </text>
            {eventName}
          </div>
          {eventTime}
          {eventLocation}
          <div>
            <text className="attributeTitle">
              <br />Organizer:&nbsp;
            </text>
            {eventOrganizer}
          </div>
          <div>
            {eventCategories}
          </div>
          <div>
            <text className="attributeTitle">
              <br />Description:&nbsp;
            </text>
            {eventDescription}
          </div>
          <FlatButton
            label={this.state.editEventButtonText}
            primary
            onTouchTap={this.editingEvent}
          />
          <FlatButton
            label="Delete"
            primary
            onTouchTap={this.confirmDelete}
          />
        </div>
      </ListItem>
    );
  }
}

export default UserEventListItem;