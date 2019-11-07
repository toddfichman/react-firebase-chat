import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import {Route, BrowserRouter} from 'react-router-dom'
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";

const firebase = require("firebase");
require("firebase/firestore");



firebase.initializeApp({
  apiKey: "AIzaSyAZUjookU54_DW-LHCv2EHJYX-yrcjyfJ8",
  authDomain: "react-chat-app-49dc3.firebaseapp.com",
  databaseURL: "https://react-chat-app-49dc3.firebaseio.com",
  projectId: "react-chat-app-49dc3",
  storageBucket: "react-chat-app-49dc3.appspot.com",
  messagingSenderId: "259171510572",
  appId: "1:259171510572:web:d03b8fca9ecba17fdb2489",
  measurementId: "G-HRKMWKGX99"
});

// firebase.analytics();

const routing = (
  <BrowserRouter>
    <div id="routing-container">
      <Route path="/login" component={Login}></Route>
      <Route path="/signup" component={SignUp}></Route>
      <Route path="/" component={Dashboard} exact></Route>
    </div>
  </BrowserRouter>
)

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// import * as serviceWorker from "./serviceWorker";
// serviceWorker.unregister();
