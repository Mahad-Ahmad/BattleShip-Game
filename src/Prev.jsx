


import React from "react";

const Test = () => {
  class GameUtil {
    constructor(size) {
      this.size = size;
      console.clear();
    }

    board = null;
    ships = [];
    totalShipBlocks = 0;
    invalidAttempts = 0;

    GenerateBoard() {
      this.SetEmptyBoard();
      this.SetShipsLength();
      this.SetAllShips();
      // console.log(this.ships, "ships");
      // console.log(this.invalidAttempts, "InvalidAttempts");
      // console.log(this.totalShipBlocks, "TotalShipBlocks");
      return this.board;
    }

    SetEmptyBoard() {
      let emptyBoard = [];

      for (let x = 0; x < this.size; x++) {
        emptyBoard.push([]);
        for (let y = 0; y < this.size; y++) {
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

      this.board = emptyBoard;
    }

    SetShipsLength() {
      const minShips = 3;
      const maxShips = parseInt(this.size / 2) + 1;
      const numberOfShips = this.GetRandomNumber(minShips, maxShips);

      const minShipsLength = 2;
      const maxShipsLength = parseInt(this.size / 2);

      for (let i = 0; i < numberOfShips; i++) {
        let shipLength = this.GetRandomNumber(minShipsLength, maxShipsLength);
        this.ships.push({ length: shipLength });
        this.totalShipBlocks += shipLength;
      }
    }

    SetAllShips() {
      for (let i = 0; i < this.ships.length; i++) {
        this.BuildShip(this.ships[i]);
      }
    }

    BuildShip(ship) {
      let boardCopy = GameUtil.CopyArrayOfObjects(this.board);
      let direction = this.GetDirection();

      let shipCoordinates = [];

      let startPoint = {
        x: this.GetRandomNumber(0, this.size - 1),
        y: this.GetRandomNumber(0, this.size - 1),
        isRevealed: false,
      };

      // console.log(
      //   `From: ${startPoint.x}_${startPoint.y} Direction: ${direction} 'ShipLength: ${ship.length} `
      // );

      let currentPoint;

      for (let i = 1; i <= ship.length; i++) {
        let nextPoint =
        i === 1 ? startPoint : this.getNextPoint(currentPoint, direction);
        console.log("🚀 ~ GameUtil ~ BuildShip ~ nextPoint:", nextPoint);

        if (!this.IsValidPoint(boardCopy, nextPoint)) {
          this.invalidAttempts += 1;
          this.BuildShip(ship);
          return;
        }

        this.SetIsShip(boardCopy, nextPoint);
        currentPoint = nextPoint;
        shipCoordinates.push(currentPoint);
      }

      this.board = boardCopy;

      ship["points"] = shipCoordinates;
    }

    static CopyArrayOfObjects(arrayObj) {
      // console.log(arrayObj);
      return JSON.parse(JSON.stringify(arrayObj));
    }

    IsValidPoint(board, point) {
      //inside the board
      if (!board[point.x] || !board[point.x][point.y]) {
        return false;
      }

      //collision check
      if (
        board[point.x][point.y].isShip &&
        this.board[point.x][point.y].isShip
      ) {
        return false;
      }

      return true;
    }

    getNextPoint(currentPoint, direction) {
      let nextPoint = {};
      switch (direction) {
        case "left":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y - 1;
          break;
        case "right":
          nextPoint.x = currentPoint.x;
          nextPoint.y = currentPoint.y + 1;
          break;
        case "up":
          nextPoint.x = currentPoint.x - 1;
          nextPoint.y = currentPoint.y;
          break;
        case "down":
          nextPoint.x = currentPoint.x + 1;
          nextPoint.y = currentPoint.y;
          break;
        default:
          throw "invalid position";
      }

      nextPoint.isRevealed = false;
      return nextPoint;
    }

    SetIsShip(board, point) {
      let selectedSquare = Object.assign({}, board[point.x][point.y]);
      selectedSquare.isShip = true;
      board[point.x][point.y] = selectedSquare;
    }

    GetDirection() {
      let direction = ["left", "right", "up", "down"];
      let directionIndex = this.GetRandomNumber(0, 3);
      return direction[directionIndex];
    }

    GetRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
  }

  //React code
  function Cell(props) {
    return (
      <div
        className={
          "cell " +
          (props.cell.isSelected ? "selected " : "") +
          (props.cell.isShip ? "ship " : "")
        }
        onClick={props.onCellClick}
      />
    );
  }

  function Board(props) {
    return (
      <div className="board">
        {props.board.map((row, rowIndex) => (
          <div className="row" key={row}>
            {row.map((cell, colIndex) => (
              <Cell
                key={rowIndex + "" + colIndex}
                onCellClick={() => props.onCellClick(cell)}
                cell={cell}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  function GameOver(props) {
    let game = props.game;

    let accuracy = (100 * game.totalShipBlocks) / game.totalShootCount;

    return (
      <div className="modal">
        <div className="modal-content">
          <h1>Game Over</h1>
          <p>
            You have sunk all ships with <strong>{parseInt(accuracy)}% </strong>{" "}
            accuracy
          </p>
          <button onClick={props.onPlayAgain}> Play Again </button>
        </div>
      </div>
    );
  }

  function GameInfo(props) {
    return (
      <div className="game-info">
        <p>Sink all ships by clicking on grid</p>
        <div className="ship-info">
          {props.ships.map((ship, index) => (
            <div className="ship-item">
              {ship.points.map((cell) => (
                <div
                  className={
                    "ship-block " + (cell.isRevealed ? "revealed " : "")
                  }
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.gameInitialize();
    }

    gameInitialize() {
      const gameUtil = new GameUtil(this.props.size);
      const gameBoard = gameUtil.GenerateBoard();
      this.state = {
        board: gameBoard,
        ships: gameUtil.ships,
        shipBlocksRevealed: 0,
        totalShipBlocks: gameUtil.totalShipBlocks,
        totalShootCount: 0,
        gameOver: false,
      };
    }

    handleCellClick(cell) {
      if (cell.isSelected) {
        return;
      }

      let selectedItem = { ...cell };
      selectedItem.isSelected = true;

      let board = [...this.state.board];
      board[cell.coordinates.x][cell.coordinates.y] = selectedItem;

      let totalShootCount = this.state.totalShootCount;
      totalShootCount += 1;

      let shipBlocksRevealed = this.state.shipBlocksRevealed;
      let ships = this.state.ships;

      if (selectedItem.isShip) {
        shipBlocksRevealed += 1;

        for (let ship of ships) {
          let isBreak = false;
          for (let shipCell of ship.points) {
            if (
              shipCell.x === cell.coordinates.x &&
              shipCell.y === cell.coordinates.y
            ) {
              shipCell.isRevealed = true;
              isBreak = true;
              break;
            }
          }
          if (isBreak) {
            break;
          }
        }
      }

      this.setState({
        ships: ships,
        board: board,
        shipBlocksRevealed: shipBlocksRevealed,
        totalShootCount: totalShootCount,
      });

      if (shipBlocksRevealed === this.state.totalShipBlocks) {
        this.setState({
          gameOver: true,
        });
      }
    }

    handlePlayAgain() {
      this.gameInitialize();

      this.setState(this.state);
    }

    render() {
      return (
        <div className="game">
          <div className="heading">
            <h1>Battleship</h1>
          </div>
          <div className="game-board">
            <Board
              board={this.state.board}
              onCellClick={(cell) => this.handleCellClick(cell)}
            />
          </div>
          <GameInfo ships={this.state.ships} />
          {this.state.gameOver && (
            <GameOver
              game={this.state}
              onPlayAgain={() => this.handlePlayAgain()}
            />
          )}
        </div>
      );
    }
  }

  return <Game size={10} />;
};

export default Test;
