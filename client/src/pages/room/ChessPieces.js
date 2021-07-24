"use strict"
import React, {useState} from 'react';

import {register, currentBoardPieces} from './context/BoardPieces.js'

import {getUserRole, onClickPiece, setBoardReady} from './context/RoomContext.js'
import {KEYWORDS} from "../../KeyWords";

const pieceMap = {
  BR:14, BN:16, BB:15, BQ:13, BK:12, BP:17,
  WR:20, WN:22, WB:21, WQ:19, WK:18, WP:23
}

let lastObjectedState = {}

function ChessPieces() {
  const [state, setState] = useState(currentBoardPieces)
  register(setState)
  setBoardReady(true)
  const role = getUserRole()
  const objectedState = {}
  for(let i in state){
    for(let j in state[i]){
      objectedState[state[i][j]] = {i, j}
    }
  }
  const lastObjectedStateCopy = {}
  for(let el in lastObjectedState){
    if(el in objectedState) {
      lastObjectedStateCopy[el] = lastObjectedState[el]
    }
  }
  lastObjectedState = lastObjectedStateCopy
  for(let el in objectedState){
    lastObjectedState[el] = objectedState[el]
  }
  const arrayedState = []
  for(let el in lastObjectedState){
    arrayedState.push({
      el,
      i: lastObjectedState[el].i,
      j: lastObjectedState[el].j
    })
  }
  return (
    <>
      {
        arrayedState.map((piece, j)=>{
          if(!piece.el)
            return ""
          return <div key={piece.el}
            style={{'--i':piece.i, '--j':piece.j}}
            data-i={piece.i} data-j={piece.j}
            data-piece={piece.el}
            className={`chess-piece ${((role === KEYWORDS.VIEWER) ||
              (role === KEYWORDS.OWNER && piece.el[0] === "B") || (role === KEYWORDS.OPPONENT && piece.el[0] === "W"))?
              "read-only" : ""}`}
            onClick={onClickPiece}
          >
            {
              String.fromCharCode(9800 + pieceMap[`${piece.el[0]}${piece.el[1]}`])
            }
          </div>
        })
      }
    </>
  );
}
export default ChessPieces;
