import React, { Component } from "react";
import { TextField, withStyles } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import styles from "./styles";

class ChatTextBox extends Component {
  state = {
    chatText: ""
  };

  userTyping = e => {
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });
    // console.log(this.state.chatText, 'usertyping');
  };

  userClickedInput = () => {
    this.props.messageReadFunc()
  };

  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      // console.log(this.state.chatText, 'submitMessage');
      this.props.submitMessageFunc(this.state.chatText)
      document.getElementById('chattextbox').value = ''
    }
    
  };

  messageValid = text => {
    // making sure that text is not just an emptry string
    return text && text.replace(/\s/g, " ").length;
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Type Here"
          onKeyUp={e => this.userTyping(e)}
          id="chattextbox"
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}
        ></TextField>
        <Send className={classes.sendBtn} onClick={this.submitMessage}></Send>
      </div>
    );
  }
}

export default withStyles(styles)(ChatTextBox);
