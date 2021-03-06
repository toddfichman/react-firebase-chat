import React, { Component } from "react";
import styles from "./styles";
import { withStyles } from "@material-ui/core";

class ChatView extends Component {

  componentDidUpdate = () => {
    const container = document.getElementById('chatview-container')
    if (container) {
      container.scrollTo(0, container.scrollHeight)
    }
  }

  render() {
    const { classes, chat, user } = this.props;
    

    if (chat === undefined) {
      return <main className={classes.content}></main>;
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>Messaging {chat.users.filter(usr => usr !== user)[0]}</div>
          <main id='chatview-container' className={classes.content}>
            {chat.messages.map((message, index) => {
              return (
                <div
                  key={index}
                  className={
                    message.sender === user
                      ? classes.userSent
                      : classes.friendSent
                  }
                >
                  {message.message}
                </div>
              );
            })}
          </main>
        </div>
      );
    }
  }
}

export default withStyles(styles)(ChatView);
