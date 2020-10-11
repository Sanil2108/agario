import React from 'react';
import { Redirect } from "react-router-dom"

export default function withNavigation(WrappedComponent) {
  return class extends React.Component {
    state = {
      goToMainMenu: null,
      goToLogin: null,
      goToGamePage: null,
    }

    goToLoginPage = () => {
      this.setState({
        goToLoginPage: {enabled: true}
      });
    }

    goToMainMenuPage = () => {
      this.setState({
        goToMainMenu: {enabled: true},
      });
    }

    goToGamePage = (gameName) => {
      this.setState({
        goToGamePage: {
          enabled: true,
          gameName
        }
      });
    }

    render() {
      const { goToGamePage, goToMainMenu, goToLogin } = this.state;

      if (goToGamePage && goToGamePage.enabled) {
        this.setState({goToGamePage: null});
        return <Redirect to={`/game/${goToGamePage.gameName}`} />;
      }

      if (goToMainMenu && goToMainMenu.enabled) {
        this.setState({goToMainMenu: null});
        return <Redirect to="/" />;
      }

      if (goToLogin && goToLogin.enabled) {
        this.setState({goToLogin: null});
        return <Redirect to="/login" />;
      }

      return <WrappedComponent
        {...this.props}
        goToLoginPage={this.goToGamePage}
        goToGamePage={this.goToGamePage}
        goToMainMenu={this.goToMainMenuPage}
      />;
    }
  }
}