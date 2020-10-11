import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "antd/dist/antd.css";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

function initializeFirebase() {
  const firebaseConfig = {
    apiKey: "AIzaSyAdiCT6hH1oXmWUucelT6mV-ChdJhlexZM",
    authDomain: "agarioclone-a7d10.firebaseapp.com",
    databaseURL: "https://agarioclone-a7d10.firebaseio.com",
    projectId: "agarioclone-a7d10",
    storageBucket: "agarioclone-a7d10.appspot.com",
    messagingSenderId: "650130250097",
    appId: "1:650130250097:web:abb114e906ca7aab397ed0",
    measurementId: "G-VMG5RCFJ8C"
  };
  firebase.initializeApp(firebaseConfig);
}

initializeFirebase();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
