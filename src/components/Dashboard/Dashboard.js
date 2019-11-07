import React, { Component } from "react";
import {Button, withStyles} from '@material-ui/core'
import ChatList from "../ChatList/ChatList";

import styles from './styles'

// const firebaseAuth = require('firebase/auth');
// const firestore = require('firebase/firestore');

const firebase = require('firebase')

export class Dashboard extends Component {
  state = {
    selectedChat: null,
    newChatFormVisible: false,
    email: null,
    chats: []
  };

  newChatBtnClicked = () => {
    console.log('newChatBtnClicked')
    this.setState({ newChatFormVisible: true, selectedChat: null });
  };

  selectChat = chatIndex => {
    return this.state.chats[chatIndex];
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async user => {
      // if there is no logged in user send them to login
      if (!user) {
        this.props.history.push("/login");
      } 
      else {
        // find all the chats assoiated to logged in user
        await firebase
          .firestore()
          .collection("chats")
          .where("users", "array-contains", user.email)
          // onSnapshot call passed in func whenever queried data changes
          .onSnapshot(async res => {
            const email = user.email
            const chats = res.docs.map(doc => doc.data());
            await this.setState({ email, chats });
            console.log(this.state)
          });
      }
    });
  };

  render() {
    return (
      <>
        <ChatList
          history={this.props.history}
          selectChatFunc={this.selectChat}
          newChatBtnFunc={this.newChatBtnClicked}
          chats={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        />
      </>
    );
  }
}

export default withStyles(styles)(Dashboard);
