import { BOARD_SIZE, FOOD_COUNT } from "./constants"

export const getRandomPositionOnBoard = () => {
  return [
    Math.random() * BOARD_SIZE.WIDTH,
    Math.random() * BOARD_SIZE.HEIGHT
  ]
}

export const getRandomColor = () => {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255]
}

export const getRandomFood = () => {
  const foodData = [];
  for (let i = 0; i < FOOD_COUNT; i += 1) {
    foodData.push({
      color: getRandomColor(),
      position: getRandomPositionOnBoard()
    });
  }

  return foodData;
}
