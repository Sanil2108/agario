import { BOARD_SIZE } from "../../constants";

const CANVAS_SIZE = {
  WIDTH: 900,
  HEIGHT: 600,
}

const FOOD_RADIUS = 5;

const MIN_VELOCITY = -10;
const MAX_VELOCITY = 10;
const ACCELERATION = 0.1;

export default class Sketch {
  addOnVelocityUpdateListener = (func) => {this.onVelocityUpdateListener = func;}

  sketchFunction = (sketch) => {
    this.sketch = sketch;

    sketch.setup = this.setup;
    sketch.draw = this.draw;
    sketch.mouseMoved = this.mouseMoved;
  }

  setup = () => {
    this.sketch.createCanvas(CANVAS_SIZE.WIDTH, CANVAS_SIZE.HEIGHT);
    this.center = {
      x: BOARD_SIZE.WIDTH / 2,
      y: BOARD_SIZE.HEIGHT / 2,
    }
  }

  draw = () => {
    this.sketch.background(255);

    this.drawPlayer();
    this.drawOtherPlayers();
    this.drawFoods();
  }

  mouseMoved = () => {
    this.updateVelocityOfCurrentPlayer();
  }

  updateVelocityOfCurrentPlayer = () => {
    if (!this.playerData) {
      return;
    }

    const currentVelocity = this.playerData.velocity;
    const newVelocity = [
      currentVelocity[0] + ((this.sketch.mouseX - (CANVAS_SIZE.WIDTH / 2)) * ACCELERATION),
      currentVelocity[1] + ((this.sketch.mouseY - (CANVAS_SIZE.HEIGHT / 2)) * ACCELERATION),
    ];
    
    newVelocity[0] = Math.min(MAX_VELOCITY, newVelocity[0]);
    newVelocity[0] = Math.max(MIN_VELOCITY, newVelocity[0]);

    newVelocity[1] = Math.min(MAX_VELOCITY, newVelocity[1]);
    newVelocity[1] = Math.max(MIN_VELOCITY, newVelocity[1]);
    this.onVelocityUpdateListener(newVelocity);
  }

  drawFoods = () => {
    if (this.allFoods) {
      for (let i = 0; i < this.allFoods.length; i += 1) {
        const food = this.allFoods[i];
        this.sketch.fill(food.color[0], food.color[1], food.color[2])
        this.sketch.ellipse(
          food.position[0] - (this.center.x - CANVAS_SIZE.WIDTH / 2),
          food.position[1] - (this.center.y - CANVAS_SIZE.HEIGHT / 2),
          FOOD_RADIUS,
          FOOD_RADIUS,
        )
      }
    }
  }

  drawPlayer = () => {
    if (this.playerData) {
      this.sketch.fill(this.playerData.color);
      this.sketch.ellipse(CANVAS_SIZE.WIDTH / 2, CANVAS_SIZE.HEIGHT / 2, 100, 100)
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
      this.updateCenter(this.playerData.position[0], this.playerData.position[1]);
    }
  }

  updateCenter = (x, y) => {
    let center = {};

    if (x < CANVAS_SIZE.WIDTH / 2) {
      center.x = CANVAS_SIZE.WIDTH / 2;
    }
    else if (x > BOARD_SIZE.WIDTH - CANVAS_SIZE.WIDTH / 2) {
      center.x = BOARD_SIZE.WIDTH - CANVAS_SIZE.WIDTH / 2;
    }
    else {
      center.x = x;
    }

    if (y < CANVAS_SIZE.HEIGHT / 2) {
      center.y = CANVAS_SIZE.HEIGHT / 2;
    }
    else if (y > BOARD_SIZE.HEIGHT - CANVAS_SIZE.HEIGHT / 2) {
      center.y = BOARD_SIZE.HEIGHT - CANVAS_SIZE.HEIGHT / 2;
    }
    else {
      center.y = y;
    }

    this.center = center;
  }
}
