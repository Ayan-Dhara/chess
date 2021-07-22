"use strict"
import React from 'react';
import ChessPieces from "./ChessPieces";

function ChessCell () {
  return (
    <div className="cell"/>
  );
}

function ChessRow (){
  return (
    <div className="row">
      {[...Array(8)].map((a, i) => <ChessCell key={i}/>)}
    </div>
  );
}

function ChessBoard(props) {
  return (
    <div className="chess-board cell">
      {[...Array(8)].map((a, i) => <ChessRow key={i}/>)}
      <ChessPieces/>
    </div>
  );
}

export default ChessBoard;