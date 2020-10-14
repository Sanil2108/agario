import { Button } from 'antd'
import React, { Component } from 'react'
import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

class LoginPage extends Component {
  componentDidMount = () => {
    
  }

  loginWithGoogle = async () => {

  }

  render() {
    return (
      <div>
        <Button>Login with Google</Button>
      </div>
    )
  }
}

export default withNavigation(LoginPage);
