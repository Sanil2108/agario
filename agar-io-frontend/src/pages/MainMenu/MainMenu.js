import React from 'react';
import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

import * as firebase from "firebase/app";
import { Button, Card, Input, Spin } from 'antd';

import { getRandomFood } from '../../utils';

class MainMenu extends React.Component {
  state = {
    allGames: null,
    gameName: '',
    createGameButtonLoading: false,
  }

  componentDidMount = () => {
    this.unsubscribe = firebase.firestore().collection('games').onSnapshot((querySnapshot) => {
      const allDocs = [];
      querySnapshot.forEach((doc) => {
        allDocs.push({...doc.data(), id: doc.id})
      });
      this.setState({
        allGames: allDocs
      });
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

      await firebase.firestore().collection('games').add({
        gameName,
        players: [],
        food: getRandomFood()
      });

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
