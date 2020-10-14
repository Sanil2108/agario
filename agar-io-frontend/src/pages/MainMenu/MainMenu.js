import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Button, Card, Input, Spin } from 'antd';

import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

class MainMenu extends React.Component {
  state = {
    allGames: null,
    gameName: '',
    createGameButtonLoading: false,
  }

  componentDidMount = () => {
    const socket = io('http://localhost:3001/');
    socket.on('connect', () => {
      socket.emit('listenToNewGames')
    });
    socket.on('allGames', (gameNames) => {
      this.setState({ allGames: JSON.parse(gameNames) });
    });
  }

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  createGame = async () => {
    const { gameName } = this.state;
    if (gameName && gameName.length > 0) {
      this.setState({
        createGameButtonLoading: true,
      });

      await axios.post('http://localhost:3001/createGame', { gameName })

      this.setState({ createGameButtonLoading: false })
    }
  }

  renderGameCard = (gameName) => {
    return (
      <Card key={gameName} title={gameName}>
        <Button type="primary" onClick={this.props.goToGamePage.bind(this, gameName)}>Join !</Button>
      </Card>
    );
  }

  render() {
    const { allGames } = this.state;

    if (!allGames) {
      return <Spin size="large"></Spin>
    }

    return (
      <div>
        <h1>Create a game</h1>
        <Input value={this.state.gameName} onChange={e => this.setState({ gameName: e.target.value })} />
        <Button loading={this.state.createGameButtonLoading} onClick={this.createGame}>Create Game!</Button>
        <h1>Existing games</h1>
        {allGames.map(game => this.renderGameCard(game))}
      </div>
    )
  }
}

export default withNavigation(MainMenu);
