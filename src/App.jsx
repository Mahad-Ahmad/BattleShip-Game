import React, { useEffect, useState } from "react";
import { Board } from "./components/Board";
import { randomDirection, randomNumber } from "./Utils/RadomNumbers";
import "./App.css";

const App = () => {
  const [boardSize, setBoardSize] = useState(10);
  const [board, setBoard] = useState([]);
  const [ships, setShips] = useState([]);

  useEffect(() => {
    let emptyBoard = [];
    for (let x = 0; x <= boardSize; x++) {
      emptyBoard.push([]);
      for (let y = 0; y <= boardSize; y++) {
        emptyBoard[x].push({
          isSelected: false,
          isShip: false,
          coordinates: {
            x: x,
            y: y,
          },
        });
      }
    }
    setBoard(emptyBoard);
  }, []);

  const onCellClick = (cell) => {
    console.log(cell);
  };

  const generateShips = () => {
    const minShips = 3;
    const maxShips = Math.floor(boardSize / 2) + 1;

    const shipsLength = randomNumber(minShips, maxShips);
    const ships = [];
    for (let i = 0; i < shipsLength; i++) {
      let Point = [];
      const direction = randomDirection();
      const shipLength = randomNumber(minShips, maxShips);

      let startPoint = {
        x: randomNumber(0, boardSize - 1),
        y: randomNumber(0, boardSize - 1),
      };

      if (direction == "left") {
        startPoint = { ...startPoint, end: startPoint.x - shipLength };
      } else if (direction == "right") {
        startPoint = { ...startPoint, end: startPoint.x + shipLength };
      } else if (direction == "up") {
        startPoint = { ...startPoint, end: startPoint.y - shipLength };
      } else if (direction == "down") {
        startPoint = { ...startPoint, end: startPoint.x + shipLength };
      }
      // if (i == 0) {
      //   ships.push({
      //     length: shipLength,
      //     x,
      //     y,
      //     direction,
      //   });
      // } else {
      // }
      console.log(startPoint, "ships");
    }

    // for (let y = 0; y < ships.length; y++) {
    //   const direction = randomDirection();
    //   let shipCoordinates = [];
    //   let start = randomNumber(0, boardSize - 1);
    //   let end = randomNumber(0, boardSize - 1);
    //   if (y == 0) {
    //     shipCoordinates.push({
    //       coordinates: {
    //         start,
    //         end,
    //         direction,
    //       },
    //     });
    //   } else {
    //     for (let k = 0; k < shipCoordinates.length; k++) {
    //       // if()
    //     }
    //   }
    // }
  };

  generateShips();

  return <Board onCellClick={onCellClick} board={board} />;
};

export default App;
