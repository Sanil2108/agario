import React from 'react';
import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

import { Button, Card, Input, Spin } from 'antd';

import { getRandomFood } from '../../utils';

class MainMenu extends React.Component {
  state = {
    allGames: null,
    gameName: '',
    createGameButtonLoading: false,
  }

  componentDidMount = () => {
    // TODO: Subscribe to the web socket

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

      // TODO: Add a game here

      this.setState({ createGameButtonLoading: false })
    }
  }

  renderGameCard = (game) => {
    return (
      <Card key={game.gameName} title={game.gameName}>
        <Button type="primary" onClick={this.props.goToGamePage.bind(this, game.id)}>Join !</Button>
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
