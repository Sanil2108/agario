const redis = require('redis');

class DatabaseManager {

  constructor() {
  }

  async cleanDatabase() {
    if (!this.redisClient) {
      return;
    }
    await new Promise((r) => {
      this.redisClient.FLUSHDB(r);
    });
  }

  initializeDatabase() {
    this.redisClient = redis.createClient();
    // this.cleanDatabase();
  }

  async getAllGameNames() {
    return await new Promise(r => this.redisClient.keys('*', (err, reply) => {
      if (!err && reply) {
        r(reply);
      }
    }));
  }

  async getGameData(gameName) {
    if (!await this.gameExists(gameName)) {
      throw new Error('Game with this name does not exist');
    }
    return await new Promise(r => this.redisClient.get(gameName, (err, reply) => r(reply)));
  }

  async updateGame(gameName, gameData) {
    await new Promise(r => this.redisClient.set(gameName, JSON.stringify(gameData), r));
  }

  async createGame(gameData) {
    if (await this.gameExists(gameData.gameName)) {
      throw new Error('Game with this name already exists');
    }

    gameData = {
      gameName: gameData.gameName,
      foods: getRandomFood(0, FOOD_COUNT),
      players: []
    }
    this.foodCount = FOOD_COUNT;
    await new Promise(r => this.redisClient.set(gameData.gameName, JSON.stringify(gameData), r));
    this.addFood(gameData.gameName);
  }

  async gameExists(gameName) {
    return await new Promise((resolve, reject) => {
      this.redisClient.get(gameName, (err, reply) => {
        if (!err) {
          resolve(reply);
        }
        else {
          reject()
        }
      })
    }) !== null;
  }

  async addPlayer(gameName, playerName) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    const playerData = gameData.players.find(player => player.name === playerName);
    if (!playerData) {
      gameData.players.push({
        playerName,
        position: getRandomPositionOnBoard(),
        velocity: [0, 0],
        radius: 40,
        color: getRandomColor(),
      });
      await this.updateGame(gameName, gameData);
    }
  }

  async updatePlayerPosition(gameName, playerName, newPosition) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    const playerData = gameData.players.find(player => player.playerName === playerName);
    playerData.position = newPosition;
    await this.updateGame(gameName, gameData);
  }

  async updatePlayerVelocity(gameName, playerName, newVelocity) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    const playerData = gameData.players.find(player => player.playerName === playerName);
    playerData.velocity = newVelocity;
    await this.updateGame(gameName, gameData);
  }

  async playerEatsFood(gameName, playerName, foodEatenId) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    const playerData = gameData.players.find(player => player.playerName === playerName);
    playerData.radius += 1;
    gameData.foods.splice(gameData.foods.findIndex(food => food.id === foodEatenId), 1)
    await this.updateGame(gameName, gameData);
  }

  async playersCollide(gameName, player1, player2) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    const player1Index = gameData.players.findIndex(player => player.playerName === player1);
    const player2Index = gameData.players.findIndex(player => player.playerName === player2);

    if (player1Index === -1 || player2Index === -1) {
      return;
    }

    if (gameData.players[player1Index].radius < gameData.players[player2Index].radius) {
      gameData.players[player2Index].radius += gameData.players[player1Index].radius;
      gameData.players.splice(player1Index, 1);
    }
    else {
      gameData.players[player1Index].radius += gameData.players[player2Index].radius;
      gameData.players.splice(player2Index, 1);
    }
    await this.updateGame(gameName, gameData);
  }

  async addFood(gameName) {
    const gameData = JSON.parse(await this.getGameData(gameName));
    gameData.foods.push(...getRandomFood(this.foodCount, FOOD_COUNT_UPDATE));
    this.foodCount += FOOD_COUNT_UPDATE;
    await this.updateGame(gameName, gameData);
    // setTimeout(this.addFood.bind(this, gameName), FOOD_COUNT_UPDATE_TIME);
  }

}

// utils
const BOARD_SIZE = {
  WIDTH: 1500,
  HEIGHT: 1500,
}
const getRandomPositionOnBoard = () => {
  return [
    Math.random() * BOARD_SIZE.WIDTH,
    Math.random() * BOARD_SIZE.HEIGHT
  ]
}

const getRandomColor = () => {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255]
}

const FOOD_COUNT = 500;
const FOOD_COUNT_UPDATE = 100;
const FOOD_COUNT_UPDATE_TIME = 2000;
const getRandomFood = (initialFoodCount = 0, foodCount = FOOD_COUNT) => {
  const foodData = [];
  for (let i = initialFoodCount; i < foodCount; i += 1) {
    foodData.push({
      id: i,
      color: getRandomColor(),
      position: getRandomPositionOnBoard()
    });
  }

  return foodData;
}

module.exports = DatabaseManager;