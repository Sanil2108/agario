import { Input, Spin, Button, Modal } from 'antd';
import React, { Component, useState } from 'react'
import io from 'socket.io-client';
import p5 from 'p5';
import Sketch from './sketch';

import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';
import { getRandomColor, getRandomFood } from '../../utils';

class GamePage extends Component {
  state = {
    gameName: this.props.match.params.gameId,
    joinGameButtonLoading: false,

    // Current player data
    playerName: null,
  }

  sketch = new Sketch()

  sketchRef = React.createRef();

  gameData = null;

  componentDidMount = () => {
    this.socket = io('http://localhost:3001/');

    // TODO: Subscribe to game updates here
    // this.unsubscribe = firebase.firestore().doc(`games/${this.state.gameId}`).onSnapshot(doc => {
    //   const docData = doc.data();
    //   const { players, food } = docData;

    //   this.sketch.updateOtherPlayers(players);
    //   this.sketch.updateFoods(food);

    //   const currentPlayer = players.find(player => this.state.playerName === player.name);
    //   this.sketch.updateCurrentPlayer(currentPlayer);

    //   this.setState({
    //     gameData: docData,
    //   })
    // });

    this.sketch.addUpdateListeners({
      onVelocityUpdate: (newVelocity) => {
        // TODO: Make API call here and handle the update when you subscribe to the data
        // const currentPlayerIndex = this.gameData.allPlayers.findIndex(playerData => playerData.name === this.state.playerName);
        // const currentPlayerData = this.gameData.allPlayers[currentPlayerIndex];
        // currentPlayerData.velocity = newVelocity;
        // const allPlayers = this.gameData.allPlayers;
        // allPlayers.splice(currentPlayerIndex, 1);
        // this.gameData = {...this.gameData, allPlayers: [...allPlayers, currentPlayerData]};

        // this.sketch.updateCurrentPlayer(currentPlayerData);
      },

      onPositionUpdate: (newPosition) => {
        this.socket.emit('updatePlayerPosition', {
          playerPosition: newPosition,
          playerName: this.state.playerName,
          gameName: this.state.gameName,
        });
      },

      onFoodEatenUpdate: (foodEatenId) => {
        // const currentPlayerIndex = this.gameData.allPlayers.findIndex(playerData => playerData.name === this.state.playerName);
        // const currentPlayerData = this.gameData.allPlayers[currentPlayerIndex];
        // currentPlayerData.radius += 1;
        // const allPlayers = this.gameData.allPlayers;
        // allPlayers.splice(currentPlayerIndex, 1);
        // this.gameData = {...this.gameData, allPlayers: [...allPlayers, currentPlayerData]};
        // this.gameData.foods.splice(this.gameData.foods.findIndex(foodData => foodData.id === foodEatenId), 1);

        // this.sketch.updateCurrentPlayer(currentPlayerData);
        // this.sketch.updateFoods(this.gameData.foods);
      }
    })

    // this.sketch.addOnVelocityUpdateListener((newVelocity) => {
    //   const players = [...this.state.gameData.players];
    //   for (let i = 0; i < players.length; i += 1) {
    //     if (players[i].name === this.state.playerName) {
    //       players[i].velocity = newVelocity;
    //       break;
    //     }
    //   }

    //   // TODO: Emit an event to update the game state
    // })

    new p5(this.sketch.sketchFunction, this.sketchRef.current)
  }

  joinGame = (playerName) => {
    if (!playerName || playerName.length === 0) {
      return;
    }

    this.setState({ joinGameButtonLoading: true });


    // TODO: Make API call here
    this.socket.on('gameUpdate', (gameData) => {
      console.log('gameJoined')
      this.setState({playerName});
      this.setState({ joinGameButtonLoading: false });

      gameData = JSON.parse(gameData);

      const otherPlayers = [...gameData.players];
      const currentPlayerIndex = gameData.players.findIndex(playerData => playerData.playerName === playerName);
      otherPlayers.splice(currentPlayerIndex, 1);
      this.sketch.updateCurrentPlayer(gameData.players[currentPlayerIndex]);
      this.sketch.updateFoods(gameData.foods);
      this.sketch.updateOtherPlayers(otherPlayers);
    });
    this.socket.emit('joinGame', { gameName: this.state.gameName, playerName });
  }

  componentWillUnmount = () => {
    // TODO: Unsubscribe here
  }

  render() {
    const { gameName, playerName, joinGameButtonLoading } = this.state;

    // TODO: Add a spinner
    // if (!gameData) {
    //   return <Spin size="large"></Spin>
    // }

    return (
      <>
        <div>

          This is game page for game Id - {gameName}

          <div ref={this.sketchRef}>

          </div>
        </div>
        <PlayerInformationModal isVisible={!playerName} onOk={this.joinGame} />
      </>
    )
  }
}

function PlayerInformationModal (props) {
  const [playerName, setPlayerName] = useState(null);

  return (<Modal
      title="Player Name"
      visible={props.isVisible}
      onOk={props.onOk.bind(null, playerName)}
      okText="Join!"
    >
      <Input value={playerName} onChange={e => setPlayerName(e.target.value)}></Input>
    </Modal>);
}

export default withNavigation(GamePage);
