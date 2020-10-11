import { Input, Spin, Button } from 'antd';
import React, { Component } from 'react'
import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';
import firebase from 'firebase';
import p5 from 'p5';
import Sketch from './sketch';
import { getRandomColor } from '../../utils';

class GamePage extends Component {
  state = {
    gameId: this.props.match.params.gameId,
    gameData: null,
    joinGameButtonLoading: false,
    playerName: '',
  }

  sketch = new Sketch()

  sketchRef = React.createRef();

  componentDidMount = () => {
    this.unsubscribe = firebase.firestore().doc(`games/${this.state.gameId}`).onSnapshot(doc => {
      const docData = doc.data();
      const { players, food } = docData;

      this.sketch.updateOtherPlayers(players);
      this.sketch.updateFoods(food);

      const currentPlayer = players.find(player => this.state.playerName === player.name);
      this.sketch.updateCurrentPlayer(currentPlayer);

      this.setState({
        gameData: docData,
      })
    });

    this.sketch.addOnVelocityUpdateListener((newVelocity) => {
      const players = [...this.state.gameData.players];
      for (let i = 0; i < players.length; i += 1) {
        if (players[i].name === this.state.playerName) {
          players[i].velocity = newVelocity;
          break;
        }
      }

      firebase.firestore().doc(`games/${this.state.gameId}`).set({
        ...this.state.gameData,
        players,
      })
    })

    new p5(this.sketch.sketchFunction, this.sketchRef.current)
  }

  joinGame = () => {
    const { playerName, gameData } = this.state;
    if (!playerName || playerName.length === 0) {
      return;
    }

    this.setState({ joinGameButtonLoading: true });

    const playerData = {
      name: playerName,
      position: [0, 0],
      velocity: [0, 0],
      size: 1,
      color: getRandomColor()
    };
    
    firebase.firestore().doc(`games/${this.state.gameId}`).set({
      ...gameData,
      players: [
        ...gameData.players,
        playerData
      ]
    }).then(() => {
      this.setState({ joinGameButtonLoading: false });
    })
  }

  componentWillUnmount = () => {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { gameData, gameId, playerName, joinGameButtonLoading } = this.state;

    if (!gameData) {
      return <Spin size="large"></Spin>
    }

    return (
      <div>
        <Input value={playerName} onChange={e => this.setState({ playerName: e.target.value })}></Input>
        <Button loading={joinGameButtonLoading} onClick={this.joinGame}>Join Game!!</Button>

        This is game page for game Id - {gameId}
        gameData is {JSON.stringify(gameData.players)}

        <div ref={this.sketchRef}>

        </div>
      </div>
    )
  }
}

export default withNavigation(GamePage);
