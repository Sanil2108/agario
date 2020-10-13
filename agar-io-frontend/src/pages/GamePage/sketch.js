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
    this.center = []
  }

  draw = () => {
    this.sketch.background(255);

    this.drawPlayer();
    this.drawOtherPlayers();
    this.drawFoods();

    this.updatePositionOfCurrentPlayer();
    this.checkFoodEaten();
  }

  mouseMoved = () => {
    this.updateVelocityOfCurrentPlayer();
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

    this.updateListeners.onPositionUpdate(currentPosition)
  }

  updateVelocityOfCurrentPlayer = () => {
    if (!this.playerData) {
      return;
    }

    const currentVelocity = [...this.playerData.velocity];
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

  drawPlayer = () => {
    if (this.playerData) {
      this.sketch.fill(this.playerData.color);
      this.sketch.ellipse(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 2, this.playerData.radius, this.playerData.radius)
    }
  }

  drawOtherPlayers = () => {}

  updateFoods = (allFoods) => {
    this.allFoods = allFoods;
  }

  updateOtherPlayers = (playersData) => {

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
