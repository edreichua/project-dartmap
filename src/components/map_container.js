// map_container.js
import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react';
import controllable from 'react-controllables';
import { connect } from 'react-redux';

import EventsWithControllableHover from './map_helpers/map_events';

import { setMapCenter, clearBalloons, getZipcodeLocation } from '../actions';

const K_SIZE = 40;

@controllable(['center', 'zoom', 'hoverKey', 'clickKey'])
class MapContainer extends Component {
  static propTypes = {
    center: PropTypes.objectOf(PropTypes.number), // @controllable
    zoom: PropTypes.number, // @controllable
    hoverKey: PropTypes.string, // @controllable
    onZoomChange: PropTypes.func, // @controllable generated fn
    onHoverKeyChange: PropTypes.func, // @controllable generated fn
    // events: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    zoom: 15, // The level in which Google Maps should zoom into. Higher is more zoomed in.
  };

  constructor(props) {
    super(props);
    this.createLocationsFromEvents = this.createLocationsFromEvents.bind(this);
    this.submitModalData = this.submitModalData.bind(this);
    // const locations = this.createLocationsFromEvents(props.events);
    this.state = {
      locations: [],
      zipcode: '',
    };
  }

  componentWillReceiveProps(newProps) {
    // newProps.events is a pre-filtered list of events to display on the map.
    if (newProps.events && newProps.events.length > 0) {
      this.createLocationsFromEvents(newProps.events);
      // this.setState({ locations });
    }
  }

  _onBoundsChange = (center, zoom /* , bounds, marginBounds */) => {
    this.props.setMapCenter({ lat: center[0], lng: center[1] });
    this.props.clearBalloons();
    this.props.onZoomChange(zoom);
  }

  _onChildClick = (key, childProps) => {
    // Recenter the map to the event that is clicked on.
    // this.props.onCenterChange([childProps.lat, childProps.lng]);
  }

  _onChildMouseEnter = (key /* , childProps */) => {
    this.props.onHoverKeyChange(key);
  }

  createLocationsFromEvents(eventList) {
    const locations = new Map();
    for (let i = 0; i < eventList.length; i += 1) {
      if (locations.has(eventList[i].location_id)) {
        locations.get(eventList[i].location_id).push(eventList[i]);
      } else {
        locations.set(eventList[i].location_id, [eventList[i]]);
      }
    }
    this.setState({ locations });
  }

  maybeSelectLocation = (event) => {
    if (this.props.handleSelectedLocation) {
      const selectedLocation = {
        id: 'x',
        name: 'New Event 1',
        location: 1,
        lat: event.lat,
        lng: event.lng,
        description: 'Location of new event',
      };
      this.props.handleSelectedLocation({ location_obj: [selectedLocation] });
      this.createLocationsFromEvents([selectedLocation]);
    }
  }

  _onChildMouseLeave = (/* key, childProps */) => {
    this.props.onHoverKeyChange(null);
  }

  submitModalData() {
    this.props.getZipcodeLocation(this.state.zipcode);
  }

  render() {
    const mapEvents = [];
    if (this.state.locations.size > 0) {
      this.state.locations.forEach((location) => {
        const { id, ...coords } = location[0];
        // EventsWithControllableHover is defined in map_helpers/map_events.js
        // The actual frontend code that displays the balloons is in map_events.js
        // This is the information that is passed to EventsWithControllableHover.
        mapEvents.push(<EventsWithControllableHover
          {...coords}
          key={id}
          id={id}
          // text={String(id)}
          // use your hover state (from store, react-controllables etc...)
          hoverKey={parseInt(this.props.hoverKey, 10)}
          eventsForLocation={location}
        />);
      });
    }
    const mapStyle = {
      height: this.props.height,
      width: this.props.width,
    };
    return (
      <div>
        <div id="map" style={mapStyle}>
          <GoogleMap
            bootstrapURLKeys={{
              key: 'AIzaSyCEV30fn0sPeqbZincSiNcHKDtmhH9omjI',
              libraries: 'places',
            }}
            center={this.props.center}
            zoom={this.props.zoom}
            hoverDistance={K_SIZE / 2}
            onBoundsChange={this._onBoundsChange}
            onClick={this.maybeSelectLocation}
            onChildClick={this._onChildClick}
            onChildMouseEnter={this._onChildMouseEnter}
            onChildMouseLeave={this._onChildMouseLeave}
          >
            {mapEvents}
            <input id="address" type="textbox" placeholder="Enter zipcode" value={this.state.zipcode}
              onChange={e => this.setState({ zipcode: e.target.value })}
            />
            <input id="submit" type="button" value="Go" onClick={this.submitModalData} />
          </GoogleMap>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    events: state.events.filteredEventList,
    userLocation: {
      lat: state.user.latitude,
      lng: state.user.longitude,
    },
    center: state.map.center,
  }
);

const mapDispatchToProps = { setMapCenter, clearBalloons, getZipcodeLocation };

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
