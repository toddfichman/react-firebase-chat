import React, { Component } from "react";
import {
  withStyles,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Button,
  ListItemIcon
} from "@material-ui/core";
import { NotificationImportant } from "@material-ui/icons";
import Spinner from '../Spinner/Spinner'
import styles from "./styles";

class ChatList extends Component {
  newChat = () => {
    console.log("new chat");
  };

  selectChat = index => {
    console.log("select chat");
  };

  render() {
    const {
      classes,
      chats,
      userEmail,
      history,
      selectChatFunc,
      newChatBtnFunc,
      selectedChatIndex
    } = this.props;

    if (chats.length > 0  ) {
      return (
        <main className={classes.root}>
          <Button variant="contained" 
            fullWidth 
            color='primary' 
            onClick={this.newChat} 
            className={classes.newChatBtn}>
              New Message
          </Button>
          <List>
            {chats.map((chat, index) => {
              return (
                <div key={index}>
                  <ListItem
                    onClick={() => this.selectChat(index)}
                    className={classes.listItem}
                    selected={selectedChatIndex === index}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar alt="Bill Plimpton">
                        {
                          chat.users
                            .filter(user => user !== userEmail)[0]
                            .split("")[0]
                        }
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={chat.users.filter(user => user !== userEmail)[0]}
                      secondary={
                        <>
                          <Typography component="span" color="textPrimary">
                            {chat.messages[
                              chat.messages.length - 1
                            ].message.substring(0, 30)}
                          </Typography>
                        </>
                      }
                    ></ListItemText>
                  </ListItem>
                  <Divider></Divider>
                </div>
              );
            })}
          </List>
        </main>
      );
    }
    else {
      return(
        <div className={classes.root}>
          <Button variant="contained" 
            fullWidth 
            color='primary' 
            onClick={this.newChat} 
            className={classes.newChatBtn}>
              New Message
          </Button>
          <Spinner/>
        </div>
      );
    }
    
  }
}

export default withStyles(styles)(ChatList);
