import { BOARD_SIZE } from "../../constants";
import { findDistance } from "../../utils";

const CANVAS_SIZE = {
  WIDTH: 900,
  HEIGHT: 600,
}

const FOOD_RADIUS = 5;

const MIN_VELOCITY = -10;
const MAX_VELOCITY = 10;
const ACCELERATION = 0.1;

export default class Sketch {
  sketchFunction = (sketch) => {
    this.sketch = sketch;

    sketch.setup = this.setup;
    sketch.draw = this.draw;
    sketch.mouseMoved = this.mouseMoved;
  }

  setup = () => {
    this.sketch.createCanvas(CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
    this.center = [];
    this.sketch.strokeWeight(2);
    this.sketch.stroke(44, 44, 44);
    this.sketch.textAlign(this.sketch.CENTER);
  }

  draw = () => {
    this.sketch.background(255);

    this.drawCurrentPlayer();
    this.drawOtherPlayers();
    this.drawFoods();

    this.updatePositionOfCurrentPlayer();
    this.checkFoodEaten();
    this.checkCollision();
  }

  mouseMoved = () => {
    this.updateVelocityOfCurrentPlayer();
  }

  checkCollision = () => {
    if (!this.otherPlayers) {
      return;
    }

    for (let i = 0; i < this.otherPlayers.length; i += 1) {
      if (findDistance(this.otherPlayers[i].position, this.playerData.position) < (this.playerData.radius + this.otherPlayers[i].radius) / 2) {
        this.updateListeners.onPlayerCollisionUpdate(this.otherPlayers[i].playerName);
      }
    }
  }

  checkFoodEaten = () => {
    if (!this.allFoods) {
      return;
    }

    for (let i = 0; i < this.allFoods.length; i += 1) {
      if (findDistance(this.allFoods[i].position, this.playerData.position) < this.playerData.radius / 2) {
        this.updateListeners.onFoodEatenUpdate(this.allFoods[i].id);
      }
    }
  }

  updatePositionOfCurrentPlayer = () => {
    if (!this.playerData) {
      return;
    }

    const currentPosition = [...this.playerData.position];
    currentPosition[0] += this.playerData.velocity[0];
    currentPosition[1] += this.playerData.velocity[1];

    currentPosition[0] = Math.max((this.playerData.radius / 2), currentPosition[0]);
    currentPosition[0] = Math.min(BOARD_SIZE.WIDTH - (this.playerData.radius / 2), currentPosition[0]);

    currentPosition[1] = Math.max((this.playerData.radius / 2), currentPosition[1]);
    currentPosition[1] = Math.min(BOARD_SIZE.HEIGHT - (this.playerData.radius / 2), currentPosition[1]);

    if (this.playerData.velocity[0] !== 0 || this.playerData.velocity[1] !== 0) {
      this.updateListeners.onPositionUpdate(currentPosition)
    }
  }

  updateVelocityOfCurrentPlayer = () => {
    if (!this.playerData) {
      return;
    }

    const newVelocity = [
      ((this.sketch.mouseX - (CANVAS_SIZE.WIDTH / 2)) * ACCELERATION),
      ((this.sketch.mouseY - (CANVAS_SIZE.HEIGHT / 2)) * ACCELERATION),
    ];
    
    newVelocity[0] = Math.min(MAX_VELOCITY, newVelocity[0]);
    newVelocity[0] = Math.max(MIN_VELOCITY, newVelocity[0]);

    newVelocity[1] = Math.min(MAX_VELOCITY, newVelocity[1]);
    newVelocity[1] = Math.max(MIN_VELOCITY, newVelocity[1]);

    this.updateListeners.onVelocityUpdate(newVelocity);
  }

  drawFoods = () => {
    if (this.allFoods) {
      for (let i = 0; i < this.allFoods.length; i += 1) {
        const food = this.allFoods[i];
        this.sketch.fill(food.color[0], food.color[1], food.color[2])
        this.sketch.ellipse(
          food.position[0] - (this.center[0] - CANVAS_SIZE.WIDTH / 2),
          food.position[1] - (this.center[1] - CANVAS_SIZE.HEIGHT / 2),
          FOOD_RADIUS,
          FOOD_RADIUS,
        )
      }
    }
  }

  drawPlayer = (playerData, position) => {
    this.sketch.fill(playerData.color);
    this.sketch.ellipse(position[0], position[1], playerData.radius, playerData.radius)
    this.sketch.fill([255, 255, 255]);
    this.sketch.textSize(24);
    this.sketch.text(playerData.playerName, position[0], position[1]);
  }

  drawCurrentPlayer = () => {
    if (this.playerData) {
      this.drawPlayer(this.playerData, [CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 2]);
    }
  }

  drawOtherPlayers = () => {
    if (this.otherPlayers) {
      for (let i = 0; i < this.otherPlayers.length; i += 1) {
        this.drawPlayer(
          this.otherPlayers[i],
          [
            this.otherPlayers[i].position[0] - (this.center[0] - CANVAS_SIZE.WIDTH / 2),
            this.otherPlayers[i].position[1] - (this.center[1] - CANVAS_SIZE.HEIGHT / 2)
          ],
        );
      }
    }
  }

  updateFoods = (allFoods) => {
    this.allFoods = allFoods;
  }

  updateOtherPlayers = (playersData) => {
    if (playersData) {
      this.otherPlayers = playersData;
    }
  }

  updateCurrentPlayer = (playerData) => {
    if (playerData) {
      this.playerData = playerData;
      this.updateCenter();
    }
  }

  updateCenter = () => {
    this.center = this.playerData.position;
  }

  addUpdateListeners = (updateListeners) => {
    this.updateListeners = updateListeners;
  }
}
