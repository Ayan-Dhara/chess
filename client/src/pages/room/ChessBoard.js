"use strict"
import React from 'react';

import ChessPieces from "./ChessPieces";

import {register, currentBoardCells} from './context/BoardCells.js'
import {onClickCell} from './context/RoomContext.js'

function ChessBoard(props) {
  const [state, setState] = React.useState(currentBoardCells);
  register(setState)
  return (
    <div className="chess-board cell">
      {
        state.map((a, i) => {
          return <div key={i} className="row">
            {
              a.map((e,j)=>{
                if(e)
                  return <div key={j} className={`cell ${e}`} onClick={()=>onClickCell(i,j)}/>
                return <div key={j} className="cell" onClick={()=>onClickCell(i,j)}/>
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
