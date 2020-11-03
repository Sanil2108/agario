const bodyParser = require('body-parser');
const DatabaseManager = require('./DatabaseManager');

const app = require('express')();

app.use(require('cors')())
app.use(bodyParser.json())

const server = require('http').createServer(app);

const io = require('socket.io')(server);

const databaseManager = new DatabaseManager();
databaseManager.initializeDatabase();

// Websockets
io.on('connect', (socket) => {
  socket.on('listenToNewGames', async () => {
    socket.join('NEW_GAMES_ROOM');
    socket.emit('allGames', JSON.stringify(await databaseManager.getAllGameNames()));
  });

  socket.on('joinGame', async ({gameName, playerName}) => {
    await databaseManager.addPlayer(gameName, playerName);
    socket.join(gameName);
    socket.emit('gameUpdate', await databaseManager.getGameData(gameName));
  });

  socket.on('updatePlayerPosition', async ({gameName, playerName, playerPosition}) => {
    await databaseManager.updatePlayerPosition(gameName, playerName, playerPosition);
    socket.emit('gameUpdate', await databaseManager.getGameData(gameName));
  });

  socket.on('updatePlayerVelocity', async ({gameName, playerName, playerVelocity}) => {
    await databaseManager.updatePlayerVelocity(gameName, playerName, playerVelocity);
    socket.emit('gameUpdate', await databaseManager.getGameData(gameName));
  });

  socket.on('foodEaten', async ({gameName, playerName, foodEatenId}) => {
    await databaseManager.playerEatsFood(gameName, playerName, foodEatenId);
    socket.emit('gameUpdate', await databaseManager.getGameData(gameName));
  });

  socket.on('playerCollision', async ({gameName, player1Name, player2Name}) => {
    await databaseManager.playersCollide(gameName, player1Name, player2Name);
    socket.emit('gameUpdate', await databaseManager.getGameData(gameName));
  })
})

// REST API
app.post('/createGame', async (req, res, next) => {
  const data = req.body;
  if (!data.gameName) {
    res.status(400).send('No game name supplied');
    return;
  }

  try {
    await databaseManager.createGame(data);
  } catch (error) {
    res.status(400).send(error.message);
    return;
  }
  io.to('NEW_GAMES_ROOM').emit('allGames', JSON.stringify(await databaseManager.getAllGameNames()));
  res.status(200).send();
});

server.listen(3001, () => {
  console.log('Server listening on port 3001')
});