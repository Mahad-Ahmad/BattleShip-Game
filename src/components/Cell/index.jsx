import React from "react";

export const Cell = ({ onCellClick, cell }) => {
  return <div key={cell} className={"cell ship "} onClick={() => onCellClick(cell)} />;
};
