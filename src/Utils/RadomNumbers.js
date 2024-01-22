import { directions } from "../Constants/Directions";

export const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const randomDirection = () => {
  return directions[randomNumber(0, 3)];
};
