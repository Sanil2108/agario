import { Button } from 'antd'
import * as firebase from "firebase/app";
import React, { Component } from 'react'
import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

class LoginPage extends Component {
  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.goToMainMenu();
      }
    })
  }

  loginWithGoogle = async () => {
    const result = await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.props.goToMainMenu();
  }

  render() {
    return (
      <div>
        <Button onClick={this.loginWithGoogle}>Login with Google</Button>
      </div>
    )
  }
}

export default withNavigation(LoginPage);
