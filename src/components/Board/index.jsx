import React, { useEffect } from "react";
import { Cell } from "../Cell";

export const Board = ({ board, onCellClick }) => {

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div className="row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <Cell onCellClick={onCellClick} cell={cell} />
          ))}
        </div>
      ))}
    </div>
  );
};
