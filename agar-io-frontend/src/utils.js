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

export const findDistance = (position1, position2) => {
  return Math.sqrt(((position1[0] - position2[0]) ** 2) + ((position1[1] - position2[1]) ** 2))
}

export const getRandomFood = () => {
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
