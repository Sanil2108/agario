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
      foods: getRandomFood(),
      players: []
    }
    await new Promise(r => this.redisClient.set(gameData.gameName, JSON.stringify(gameData), r));
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
        position: [0, 0],
        velocity: [0, 0],
        radius: 10,
        color: getRandomColor(),
      });
      await this.updateGame(gameName, gameData);
    }
  }

  async updatePlayerPosition(gameName, playerName, newPosition) {

  }

  async updatePlayerVelocity(gameName, playerName, newVelocity) {

  }

  async playerEatsFood(gameName, playerName, foodEatenId) {

  }

}

// utils
const BOARD_SIZE = {
  WIDTH: 2500,
  HEIGHT: 2500,
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

const FOOD_COUNT = 100;
const getRandomFood = () => {
  const foodData = [];
  for (let i = 0; i < FOOD_COUNT; i += 1) {
    foodData.push({
      id: i,
      color: getRandomColor(),
      position: getRandomPositionOnBoard()
    });
  }

  return foodData;
}

module.exports = DatabaseManager;