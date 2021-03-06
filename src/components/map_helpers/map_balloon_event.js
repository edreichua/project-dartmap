// map_balloon_event.js

import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import {ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import {grey400, darkBlack, lightBlack,blue700} from 'material-ui/styles/colors';
import { clearBalloons } from '../../actions';

const MapBalloonEvent = (props) => {
  const event = props.event;
  const categoryString = event.categories.map((cat) => {
    return cat.name;
  }).join(', ');
  const listItemStyle = {

  };

  return (
    <ListItem
      value={props.num}
      primaryText={event.name + ' @ ' + event.start_time.format('h:mm A')}
      secondaryText={event.description}
      secondaryTextLines={1}
      leftAvatar={<Avatar src={event.icon_url} />}
      key={'outer-text'.concat(props.num)}
      nestedItems={[
        <ListItem
              value={props.num}
              containerElement={<Link to={'/events/'.concat(event.id)} />}
              secondaryText={
                <text>
                  <span style={{color: darkBlack}}>Description</span>
                  <div className="popup-description">{event.description}</div>
                  <span style={{color: darkBlack}}>Organizer</span>
                  <div className="popup-description">{event.organizer}</div>
                  <span style={{color: darkBlack}}>Categories</span>
                  <div className="popup-description">{categoryString}</div><br />
                  <span style={{color: blue700}}>Click to view more information</span>
                </text>}
              style={listItemStyle}
              key={'nested-info'.concat(props.num)}
              onClick={props.clearBalloons}
        />,
      ]}
    />
  );
};
const mapStateToProps = state => (
  { }
);
const mapDispatchToProps = { clearBalloons };

export default connect(mapStateToProps, mapDispatchToProps)(MapBalloonEvent);
