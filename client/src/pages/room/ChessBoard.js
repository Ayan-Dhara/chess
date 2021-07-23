"use strict"
import React from 'react';
import ChessPieces from "./ChessPieces";
import Context from "./context/RoomContext";

function ChessRow (){
  return (
    <div className="row">
      {[...Array(8)].map((a, i) => <div className="cell" key={i}/>)}
    </div>
  );
}

function ChessBoard(props) {
  const state = React.useContext(Context);
  const boardCells = state.boardCells
  return (
    <div className="chess-board cell">
      {
        boardCells.map((a, i) => {
          return <div key={i} className="row">
            {
              a.map((e,j)=>{
                if(e)
                  return <div key={j} className={`cell ${e}`} />
                return <div key={j} className="cell"/>
              })
            }
          </div>
        })
      }
      <ChessPieces/>
    </div>
  );
}

export default ChessBoard;
