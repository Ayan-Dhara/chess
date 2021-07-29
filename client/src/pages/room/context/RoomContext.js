"use strict"

import {change as changeBoardPieces, currentBoardPieces} from './BoardPieces.js'
import {change as changeBoardCells, currentBoardCells} from "./BoardCells.js";
import {change as changeNamePopup} from "./NamePopUp.js";

import {KEYWORDS} from "../../../KeyWords.js";

const LOCAL_PORT = 5000
const socket = new WebSocket(`${window.location.protocol.replace("http", "ws")}//${window.location.hostname}:${(window.location.hostname==="localhost"||window.location.hostname.toString().startsWith("127.0.0"))?LOCAL_PORT:window.location.port}/ws${window.location.pathname}`)

// initiate communication
let boardReady = false;
export function setBoardReady(status){boardReady = status}
const requestInitialBoard = () => {
  const userName = localStorage.getItem("userName")
  const userID = localStorage.getItem("userID")
  if (!userName){
    // show name input popup
    changeNamePopup(true)
    return
  }
  if (!boardReady){
    setTimeout(()=>{
      requestInitialBoard()
    }, 100)
    return
  }
  socket.send(JSON.stringify({
    type: KEYWORDS.CONNECT,
    userName,
    userID
  }))
}
socket.addEventListener("open", ()=>{
  setTimeout(()=>{
    requestInitialBoard()
  }, 100)
})

let userRole = null
export function getUserRole(){
  return userRole
}

// handle incoming message
socket.addEventListener("message", (event) =>{
  let message = {}
  try {
    message = JSON.parse(event.data)
  }catch(e){}
  handleMessage(message)
})
const handleMessage = (message)=>{
  switch (message.type){
    case KEYWORDS.PING: {
      break
    }
    case KEYWORDS.STATUS: {
      switch(message.status){
        case KEYWORDS.NO_NAME: {
          window.location.reload()
          break
        }
        case KEYWORDS.CLOSED: {
          socket.close()
          alert("Socket is closed")
          break
        }
        default: {
          console.log("STATUS", message.status)
        }
      }
      break
    }
    case KEYWORDS.BOARD: {
      changeBoardPieces(message[KEYWORDS.BOARD])
      // console.table(message[KEYWORDS.BOARD])
      break
    }
    case KEYWORDS.USERS: {
      // set users list
      break
    }
    case KEYWORDS.INITIATE: {
      userRole = message[KEYWORDS.ROLE]
      changeBoardPieces(message[KEYWORDS.BOARD])
      break
    }
    case KEYWORDS.CREATE_ID: {
      const userID = message.userID
      localStorage.setItem("userID", userID)
      window.location.reload()
      break
    }
    default:{
      console.log("Cannot identify message")
    }
  }
}


// handle piece click
// 0 once
// 1 infinite
// 2 move and cut different
// 3 special
export const pieceMoves = {
  K: {
    move: [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ],
    castling: [
      [0, 1], [0,-1]
    ],
    type: 3
  },
  Q: {
    move: [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ],
    type: 1
  },
  R: {
    move: [
      [-1, 0], [0, -1], [0, 1], [1, 0],
    ],
    type: 1
  },
  B: {
    move: [
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ],
    type: 1
  },
  N:  {
    move: [
      [-1, 2], [-1, -2], [1, 2], [1, -2], [-2, 1], [-2, -1], [2, 1], [2, -1]
    ],
    type: 0
  },
  P:  {
    initial: [
      [-1, 0], [-2, 0]
    ],
    move: [
      [-1, 0]
    ],
    cut: [
      [-1, 1], [-1, -1]
    ],
    type: 3
  }
}
let castlingUsed = false
let leftRookMoved = false
let rightRookMoved = false
let kingMoved = false
export const onClickPiece = (event) => {
  const piece = event.target
  const i = piece.dataset.i * 1
  const j = piece.dataset.j * 1
  const type = piece.dataset.piece
  removeHighlights()
  if(movingPiece === piece){
    movingPiece = null
    return
  }
  movingPiece = piece
  const boardCells = [...currentBoardCells]
  boardCells[i][j] = "selected"
  const moves = pieceMoves[type[1]].move
  switch (pieceMoves[type[1]].type){
    case 0:{
      for (let [dx, dy] of moves){
        let x = i + dx
        let y = j + dy
        if(x > -1 && y > -1 && x < 8 && y < 8){
          if(haveSameSidePiece(type, x, y)){
            continue
          }
          if(haveOtherSidePiece(type, x, y)){
            boardCells[x][y] = "red"
          }
          else{
            boardCells[x][y] = "green"
            x = x + dx
            y = y + dy
          }
        }
      }
      break
    }
    case 1: {
      for (let [dx, dy] of moves){
        let x = i + dx
        let y = j + dy
        while(x > -1 && y > -1 && x < 8 && y < 8){
          if(haveSameSidePiece(type, x, y)){
            break
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
      break
    }
    default: {
      switch(type[1]){
        case "K": {
          // primary move
          for (let [dx, dy] of moves){
            let x = i + dx
            let y = j + dy
            if(x > -1 && y > -1 && x < 8 && y < 8){
              if(haveSameSidePiece(type, x, y)){
                continue
              }
              if(haveOtherSidePiece(type, x, y)){
                boardCells[x][y] = "red"
              }
              else{
                boardCells[x][y] = "green"
                x = x + dx
                y = y + dy
              }
            }
          }
          // castling
          break
        }
        case "P": {
          if(i === 6){
            // initial move
            for (let [dx, dy] of pieceMoves["P"].initial){
              let x = i + dx
              let y = j + dy
              if(x > -1 && y > -1 && x < 8 && y < 8){
                if(haveSameSidePiece(type, x, y)){
                  break
                }
                if(haveOtherSidePiece(type, x, y)){
                  break
                }
                boardCells[x][y] = "green"
              }
            }
          }
          else {
            // primary move
            for (let [dx, dy] of pieceMoves["P"].move){
              let x = i + dx
              let y = j + dy
              if(x > -1 && y > -1 && x < 8 && y < 8){
                if(haveSameSidePiece(type, x, y)){
                  continue
                }
                if(haveOtherSidePiece(type, x, y)){
                  continue
                }
                boardCells[x][y] = "green"
              }
            }
          }
          // cut move
          for (let [dx, dy] of pieceMoves["P"].cut) {
            let x = i + dx
            let y = j + dy
            if (x > -1 && y > -1 && x < 8 && y < 8) {
              if (haveOtherSidePiece(type, x, y)) {
                boardCells[x][y] = "red"
              }
            }
          }
          break
        }
      }
    }
  }
  changeBoardCells(boardCells)
}
const haveSameSidePiece = (type, x, y)=>{
  for(let i in currentBoardPieces){
    for(let j in currentBoardPieces[i]){
      if(x === i*1 && y === j*1){
        if(currentBoardPieces[i][j][0] && currentBoardPieces[i][j][0] === type[0])
          return true
      }
    }
  }
  return false
}
const haveOtherSidePiece = (type, x, y)=>{
  for(let i in currentBoardPieces){
    for(let j in currentBoardPieces[i]){
      if(x === i*1 && y === j*1){
        if(currentBoardPieces[i][j][0] && currentBoardPieces[i][j][0] !== type[0])
          return true
      }
    }
  }
  return false
}


// handle cell click
export let movingPiece = null
export const onClickCell = (x, y) =>{
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
          x: x,
          y: y
        }
      }
    }
  ))
  removeHighlights()
  movingPiece = null
}
export const removeHighlights = () => {
  const boardCells = [...currentBoardCells]
  for(let i in boardCells){
    for(let j in boardCells[i]){
      boardCells[i][j] = undefined
    }
  }
  changeBoardCells(boardCells)
}
