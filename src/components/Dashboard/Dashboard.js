import React, { Component } from "react";
import { Button, withStyles } from "@material-ui/core";
import styles from "./styles";
import ChatList from "../ChatList/ChatList";
import ChatView from "../ChatView/ChatView";
import ChatTextBox from "../ChatTextBox/ChatTextBox";

// const firebaseAuth = require('firebase/auth');
// const firestore = require('firebase/firestore');

const firebase = require("firebase");

export class Dashboard extends Component {
  state = {
    selectedChat: null,
    newChatFormVisible: false,
    email: null,
    chats: []
  };

  newChatBtnClicked = () => {
    console.log("newChatBtnClicked");
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  selectChat = chatIndex => {
    console.log(chatIndex);
    this.setState({ selectedChat: chatIndex });
  };

  signOut = () => {
    firebase.auth().signOut();
  };

  submitMessage = msg => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        user => user !== this.state.email
      )
    );
    firebase
      .firestore()
      .collection('chats')
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now()
        }),
        receiverHasRead: false
      })
  };

  // friend => user1:user2 (from firebase)
  buildDocKey = friend => {
    console.log(friend[1], friend, 'friends')
    return [this.state.email, friend].sort().join(":");
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async user => {
      // if there is no logged in user send them to login
      if (!user) {
        this.props.history.push("/login");
      } else {
        // find all the chats assoiated to logged in user
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", user.email)
          // onSnapshot call passed in func whenever queried data changes
          .onSnapshot(async res => {
            const email = user.email;
            const chats = res.docs.map(doc => doc.data());
            await this.setState({ email, chats });
            console.log(this.state);
          });
      }
    });
  };

  render() {
    const { classes, history } = this.props;
    const { chats, email, selectedChat, newChatFormVisible } = this.state;

    return (
      <>
        <ChatList
          history={history}
          selectChatFunc={this.selectChat}
          newChatBtnFunc={this.newChatBtnClicked}
          chats={chats}
          userEmail={email}
          selectedChatIndex={selectedChat}
        />
        {newChatFormVisible ? null : (
          <ChatView user={email} chat={chats[selectedChat]} />
        )}
        {selectedChat !== null ? (
          <ChatTextBox submitMessageFunc={this.submitMessage} />
        ) : null}

        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
