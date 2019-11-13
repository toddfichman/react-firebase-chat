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

  selectChat = async chatIndex => {
    console.log('selectChat');
    await this.setState({ selectedChat: chatIndex });
    this.messageRead()
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
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now()
        }),
        receiverHasRead: false
      });
  };

  // friend => user1:user2 (from firebase)
  buildDocKey = friend => {
    
    return [this.state.email, friend].sort().join(":");
  };

  messageRead = () => {
    const chatIndex = this.state.selectedChat
    const docKey = this.buildDocKey(
      this.state.chats[chatIndex].users.filter(
        user => user !== this.state.email
      )
    );
    

    if (this.clickedChatWhereNotSender(chatIndex)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log('clicked message where user')
    }
  };


  // return false if sender is current user, true otherwise
  clickedChatWhereNotSender = chatIndex => {
    
    return this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ] !== this.state.email;
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
          <ChatTextBox messageReadFunc={this.messageRead} submitMessageFunc={this.submitMessage} />
        ) : null}

        <Button className={classes.signOutBtn} onClick={this.signOut}>
          Sign Out
        </Button>
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
