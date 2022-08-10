import React, {useState} from 'react';

import {register, currentBoardPieces} from './context/BoardPieces'

import {getUserRole, onClickPiece, setBoardReady} from './context/RoomContext'
import {KEYWORDS} from "../../KeyWords";

const pieceMap: any = {
  BR: 14, BN: 16, BB: 15, BQ: 13, BK: 12, BP: 17,
  // BR:20, BN:22, BB:21, BQ:19, BK:18, BP:23,
  WR: 20, WN: 22, WB: 21, WQ: 19, WK: 18, WP: 23
}

let lastObjectedState: any = {}

function ChessPieces() {
  const [state, setState] = useState(currentBoardPieces)
  register(setState)
  setBoardReady(true)
  const role = getUserRole()
  const objectedState: any = {}
  for (let i in state) {
    for (let j in state[i]) {
      // @ts-ignore
      objectedState[state[i][j]] = {i, j}
    }
  }
  const lastObjectedStateCopy: any = {}
  for (let el in lastObjectedState) {
    if (el in objectedState) {
      lastObjectedStateCopy[el] = lastObjectedState[el]
    }
  }
  lastObjectedState = lastObjectedStateCopy
  for (let el in objectedState) {
    lastObjectedState[el] = objectedState[el]
  }
  const arrayedState = []
  for (let el in lastObjectedState) {
    arrayedState.push({
      el,
      i: lastObjectedState[el].i,
      j: lastObjectedState[el].j
    })
  }
  return (
    <>
      {
        arrayedState.map((piece: any, j) => {
          if (!piece.el)
            return ""
          const piece_style: any = {'--i': piece.i, '--j': piece.j}
          return <div key={piece.el}
                      style={piece_style}
                      data-i={piece.i} data-j={piece.j}
                      data-piece={piece.el}
                      className={`chess-piece ${((role === KEYWORDS.VIEWER) ||
                        (role === KEYWORDS.OWNER && piece.el[0] === "B") || (role === KEYWORDS.OPPONENT && piece.el[0] === "W")) ?
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
