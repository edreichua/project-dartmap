import React from 'react';

import { RaisedButton, Avatar, TextField } from 'material-ui';
const NO_PROF_PIC = 'https://image.freepik.com/icones-gratis/macho-acima-silhueta-escura_318-39674.png';

class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const text = this.state.text.trim();
    if (!text) {
      return;
    }
    const toSend = this.props.constructComment(text);
    this.props.onCommentSubmit(toSend);
    this.setState({
      text: '',
    });
  }

  render() {
    let profPicUrl = this.props.user && this.props.user.fbProfPicUrl;
    profPicUrl = profPicUrl || NO_PROF_PIC;
    const styles = {
      avatar: {
        marginRight: 20,
      },
      button: {
        margin: 12,
      },
      text: {
        width: '80%',
      },
    };

    return (
      <div className="row">
        <Avatar
          src={profPicUrl}
          style={styles.avatar}
        />
        <TextField style={styles.text}
          floatingLabelText="Add Comment"
          value={this.state.text} onChange={this.handleTextChange}
        />
        <div className="pull-right" style={styles.button}>
          <RaisedButton label="Post" primary onClick={this.handleSubmit} />
        </div>
      </div>
    );
  }
}

export default CommentForm;
