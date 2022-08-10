import React from 'react';

import ChessPieces from "./ChessPieces";

import {register, currentBoardCells} from './context/BoardCells'
import {onClickCell} from './context/RoomContext'

function ChessBoardCells() {
  const [state, setState] = React.useState(currentBoardCells);
  register(setState)
  return (
    <>
      {
        state.map((a, i) => {
          return <div key={i} className="row">
            {
              a.map((e, j) => {
                if (e)
                  return <div key={j} className={`cell ${e}`} onClick={() => onClickCell(i, j)}/>
                return <div key={j} className="cell" onClick={() => onClickCell(i, j)}/>
              })
            }
          </div>
        })
      }
    </>
  );
}

function ChessBoard(props: any) {
  return (
    <div className="chess-board cell">
      <ChessBoardCells/>
      <ChessPieces/>
    </div>
  );
}

export default ChessBoard;
