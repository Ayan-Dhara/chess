"use strict"
import React, {useReducer, useState} from 'react'

import {KEYWORDS} from "../../../KeyWords";

const Context = React.createContext(undefined)
export default Context

const LOCAL_PORT = 5000
const socket = new WebSocket(`${window.location.protocol.replace("http", "ws")}//${window.location.hostname}:${(window.location.hostname==="localhost"||window.location.hostname.toString().startsWith("127.0.0"))?LOCAL_PORT:window.location.port}/ws${window.location.pathname}`)

let dispatchFunction = (action) => {}

let piecesArray = []
const handleMessage = (state, message)=>{
  state = {...state}
  switch (message.type){
    case KEYWORDS.MOVE: {
      console.log("MOVE", message.move)
      break
    }
    case KEYWORDS.STATUS: {
      console.log("STATUS", message.status)
      break
    }
    case KEYWORDS.BOARD: {
      state.pieces = message[KEYWORDS.BOARD]
      piecesArray = state.pieces
      break
    }
    default:{
      console.log("Cannot identify message")
    }
  }
  return state
}

let movingPiece = null
const requestMove = (x, y) =>{
  if(!movingPiece)
    return
  socket.send(JSON.stringify(
    {
      type: KEYWORDS.MOVE,
      move: {
        from:{
          x: movingPiece.dataset.i,
          y: movingPiece.dataset.j
        },
        to:{
          x, y
        }
      }
    }
  ))
}

let setBoardCellsFunction = (arr)=>{}

// 0 once
// 1 infinite
// 2 move and cut different
// 3 special (king)
const pieceMoves = {
  K: {
    move: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ],
    castling: [
      [0, 1],
      [0,-1]
    ],
    type: 3
  },
  Q: {
    move: [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ],
    type: 1
  },
  R: {
    move: [
      [-1, 0],
      [0, -1],
      [0, 1],
      [1, 0],
    ],
    type: 1
  },
  B: {
    move: [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1]
    ],
    type: 1
  },
  N:  {
    move: [
      [-1, 2],
      [-1, -2],
      [1, 2],
      [1, -2],
      [-2, 1],
      [-2, -1],
      [2, 1],
      [2, -1]
    ],
    type: 0
  },
  P:  {
    move: [
      [-1, 0]
    ],
    cut: [
      [-1, 1],
      [-1, -1]
    ],
    type: 2
  }
}
const pieceClick = (event) => {
  const piece = event.target
  const i = piece.dataset.i*1
  const j = piece.dataset.j*1
  const type = piece.dataset.piece
  removeHighlights()
  setBoardCellsFunction((boardCells)=>{
    boardCells[i][j] = "selected"
    const moves = pieceMoves[type[1]].move
    switch (pieceMoves[type[1]].type){
      case 1: {
        for (let [dx, dy] of moves){
          let x = i + dx
          let y = j + dy
          while(x > -1 && y > -1 && x < 8 && y < 8){
            if(haveSameSidePiece(type, x, y)){
              // break
            }
            if(haveOtherSidePiece(type, x, y)){
              boardCells[x][y] = "red"
              break
            }
            boardCells[x][y] = "green"
            x = x + dx
            y = y + dy
          }
        }
      }
    }
    return [...boardCells]
  })
}

const haveSameSidePiece = (type, x, y)=>{
  for(let i in piecesArray){
    for(let j in piecesArray[i]){
      if(x == i && y == j){
        if(piecesArray[i][j][0] == type[0])
          return true
      }
    }
  }
  return false
}
const haveOtherSidePiece = (type, x, y)=>{
  for(let i in piecesArray){
    for(let j in piecesArray[i]){
      if(x == i && y == j){
        if(piecesArray[i][j][0] && piecesArray[i][j][0] != type[0])
          return true
      }
    }
  }
  return false
}

const removeHighlights = () => {
  setBoardCellsFunction((boardCells)=>{
    for(let i in boardCells){
      for(let j in boardCells[i]){
        boardCells[i][j] = undefined
      }
    }
    return [...boardCells]
  })
}

socket.addEventListener("message", (event) =>{
  let message = {}
  try {
    message = JSON.parse(event.data)
  }catch(e){}
  dispatchFunction(message)
})

socket.addEventListener("open", (event)=>{
  event.target.send(JSON.stringify({
    type: KEYWORDS.REQUEST,
    request: KEYWORDS.BOARD
  }))
})

export function RoomContext({children}) {
  const [state, dispatch] = useReducer(handleMessage, {}, e=>e)
  dispatchFunction = dispatch
  const [boardCells, setBoardCells] = useState([...Array(8)].map(()=>[...Array(8)]))
  setBoardCellsFunction = setBoardCells
  const finalState = {
    ...state,
    boardCells,
    requestMove,
    pieceClick
  }
  return (
    <Context.Provider value={finalState}>
      {children}
    </Context.Provider>
  )
}
