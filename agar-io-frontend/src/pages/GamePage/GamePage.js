import { Input, Modal } from 'antd';
import React, { Component, useState } from 'react'
import io from 'socket.io-client';
import p5 from 'p5';
import Sketch from './sketch';

import withNavigation from '../../components/WithNavigationComponent/withNavigationComponent';

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

    this.sketch.addUpdateListeners({
      onVelocityUpdate: (newVelocity) => {
        this.socket.emit('updatePlayerVelocity', {
          playerVelocity: newVelocity,
          playerName: this.state.playerName,
          gameName: this.state.gameName
        });
      },

      onPositionUpdate: (newPosition) => {
        this.socket.emit('updatePlayerPosition', {
          playerPosition: newPosition,
          playerName: this.state.playerName,
          gameName: this.state.gameName,
        });
      },

      onFoodEatenUpdate: (foodEatenId) => {
        this.socket.emit('foodEaten', {
          foodEatenId: foodEatenId,
          playerName: this.state.playerName,
          gameName: this.state.gameName,
        });
      },

      onPlayerCollisionUpdate: (playerCollidedWith) => {
        this.socket.emit('playerCollision', {
          player2Name: playerCollidedWith,
          player1Name: this.state.playerName,
          gameName: this.state.gameName,
        })
      }
    })

    new p5(this.sketch.sketchFunction, this.sketchRef.current)
  }

  joinGame = (playerName) => {
    if (!playerName || playerName.length === 0) {
      return;
    }

    this.setState({ joinGameButtonLoading: true });


    // TODO: Make API call here
    this.socket.on('gameUpdate', (gameData) => {
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
