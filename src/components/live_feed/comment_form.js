import React from 'react';

class CommentForm extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleTextChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  handleSubmit(e) {
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
    return (
      <li className="row collection-header">
        <div className="col m1">
          <img className="circle responsive-img" src="https://s3.amazonaws.com/dartmap/edrei.jpg" alt="avatar" />
        </div>
        <div className="col m11">
          <input className="form-control" placeholder="Add a comment" type="text" value={this.state.text} onChange={this.handleTextChange} />
          <a className="waves-effect waves-teal btn-flat" onClick={this.handleSubmit}>Post</a>
        </div>
      </li>
    );
  }
}

export default CommentForm;