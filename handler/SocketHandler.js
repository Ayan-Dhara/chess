"use strict"

import {KEYWORDS} from "../client/src/KeyWords.js";
import sha256 from "sha256";

const initialBoard = [
  ["RL", "NL", "BL", "Q0", "K0", "BR", "NR", "RR"].map(c=>"B"+c),
  ["P", "P", "P", "P", "P", "P", "P", "P"].map((c,i)=>"B"+c+(i+1)),
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"].map((c,i)=>"W"+c+(i+1)),
  ["RL", "NL", "BL", "Q0", "K0", "BR", "NR", "RR"].map(c=>"W"+c)
]
const rooms = []

const rotateBoard180deg = (board) => {
  const newBoard = []
  for(let i in board){
    newBoard[i] = []
    for(let j in board[i]){
      newBoard[i][j]  = board[7-i][7-j]
    }
  }
  return newBoard
}

const copyObject = (obj)=>{
  try{
    const newObj = {...obj}
    for(let key in newObj){
      newObj[key] = copyObject(newObj[key])
    }
    return newObj
  }catch(e){}
  return obj
}
const copyArray = (arr, level)=>{
  if(level<1)
    return arr
  try{
    const newArr = [...arr]
    for(let i in newArr){
      newArr[i] = copyArray(newArr[i], level-1)
    }
    return newArr
  }catch(e){}
  return arr
}
const pieceMoves = {
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
const validMove = (board, move, moveByOwner)=>{
  const i = move.from.x * 1
  const j = move.from.y * 1
  const type = board[i][j]
  if(!type[1])
    return false
  const moves = pieceMoves[type[1]].move
  switch (pieceMoves[type[1]].type){
    case 0:{
      for (let [dx, dy] of moves){
        let x = i + dx
        let y = j + dy
        if(x > -1 && y > -1 && x < 8 && y < 8){
          if(haveSameSidePiece(board, type, x, y)){
            continue
          }
          if(x === move.to.x && y === move.to.y)
            return true
        }
      }
      break
    }
    case 1: {
      for (let [dx, dy] of moves){
        let x = i + dx
        let y = j + dy
        while(x > -1 && y > -1 && x < 8 && y < 8){
          if(haveSameSidePiece(board, type, x, y)){
            break
          }
          if(haveOtherSidePiece(board, type, x, y)){
            if(x === move.to.x && y === move.to.y)
              return true
            break
          }
          if(x === move.to.x && y === move.to.y)
            return true
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
              if(haveSameSidePiece(board, type, x, y)){
                continue
              }
              if(haveOtherSidePiece(board, type, x, y)){
                if(x === move.to.x && y === move.to.y)
                  return true
              }
              else{
                if(x === move.to.x && y === move.to.y)
                  return true
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
                if(haveSameSidePiece(board, type, x, y)){
                  continue
                }
                if(haveOtherSidePiece(board, type, x, y)){
                  continue
                }
                if(x === move.to.x && y === move.to.y)
                  return true
              }
            }
          }
          else {
            // primary move
            for (let [dx, dy] of pieceMoves["P"].move){
              let x = i + dx
              let y = j + dy
              if(x > -1 && y > -1 && x < 8 && y < 8){
                if(haveSameSidePiece(board, type, x, y)){
                  continue
                }
                if(haveOtherSidePiece(board, type, x, y)){
                  continue
                }
                if(x === move.to.x && y === move.to.y)
                  return true
              }
            }
          }
          // cut move
          for (let [dx, dy] of pieceMoves["P"].cut) {
            let x = i + dx
            let y = j + dy
            if (x > -1 && y > -1 && x < 8 && y < 8) {
              console.log(move, x, y)
              if (haveOtherSidePiece(board, type, x, y)) {
                console.log(x, y)
                if(x === move.to.x && y === move.to.y)
                  return true
                else{
                }
              }
            }
          }
          break
        }
      }
    }
  }
  return false
}

const haveSameSidePiece = (board, type, x, y)=>{
  console.table(board)
  for(let i in board){
    for(let j in board[i]){
      if(x === i*1 && y === j*1){
        if(board[i][j][0] && board[i][j][0] === type[0])
          return true
      }
    }
  }
  return false
}

const haveOtherSidePiece = (board, type, x, y)=>{
  for(let i in board){
    for(let j in board[i]){
      if(x*1 === i*1 && y*1 === j*1){
        if(board[i][j][0] && board[i][j][0] !== type[0])
          return true
      }
    }
  }
  return false
}

const moveSafely = (board, move)=> {
  board[move.to.x][move.to.y] = board[move.from.x][move.from.y]
  board[move.from.x][move.from.y] = ''
}

const roomBroadcast = (room, data) => {
  room?.owner?.send(data)
  room?.opponent?.send(data)
  for(let viewer of room.viewers){
    viewer?.send(data)
  }
}

function messageHandler(event){
  const socket = event.target
  let data = {}
  try{
    data = JSON.parse(event.data);
  }catch(e){}
  const message = data

  switch(message.type){
    case KEYWORDS.MOVE:{
      const room = rooms[event.target.path]
      if (room.owner !== socket && room.opponent !== socket)
        return;

      // chance verification
      const moveByOwner = (socket === room.owner)
      if (moveByOwner === room.lastTurn)
        return

      // turn verified
      const move = message[KEYWORDS.MOVE]
      const board = room.board
      if(validMove((socket === room.opponent)?rotateBoard180deg(board):board, move, moveByOwner)){
        room.lastTurn = moveByOwner
        if(socket === room.opponent){
          move.from.x = 7 - move.from.x
          move.from.y = 7 - move.from.y
          move.to.x = 7 - move.to.x
          move.to.y = 7 - move.to.y
        }
        moveSafely(board, move)
        // broadcast to the room
        room?.opponent?.send(JSON.stringify({
          type: KEYWORDS.BOARD,
          board: rotateBoard180deg(board)
        }))
        const data = JSON.stringify({
          type: KEYWORDS.BOARD,
          board: board
        })
        room?.owner?.send(data)
        for(let viewer of room.viewers){
          viewer?.send(data)
        }
      }
      else {
        console.log("invalid move")
      }
      break;
    }
    case KEYWORDS.CONNECT: {
      const userID = message.userID
      const userName = message.userName
      if(!userID){
        socket.send(JSON.stringify({
          type: KEYWORDS.CREATE_ID,
          userID: sha256("User_" + Date.now() + "." + process.hrtime()[1])
        }))
        break;
      }
      if(!userName){
        socket.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.NO_NAME
        }))
        break;
      }
      const room = rooms[socket.path]
      socket.name = userName
      socket.user = userID

      if (!room.owner){
        room.owner = socket
        socket.role = KEYWORDS.OWNER
      }
      else if (room.owner.user === socket.user){
        room.owner.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.CLOSED
        }))
        room.owner.role = KEYWORDS.CLOSED
        room.owner = socket
        room.owner.role = KEYWORDS.OWNER
      }
      else if (!room.opponent) {
        room.opponent = socket
        socket.role = KEYWORDS.OPPONENT
      }
      else if (room.opponent.user === socket.user){
        room.opponent.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.CLOSED
        }))
        room.opponent.role = KEYWORDS.CLOSED
        room.opponent = socket
        socket.role = KEYWORDS.OPPONENT
      }
      else {
        socket.role = KEYWORDS.VIEWER
        room.viewers.push(socket)
      }

      const role = socket.role
      socket.send(JSON.stringify({
        type: KEYWORDS.INITIATE,
        role,
        board: (role === KEYWORDS.OPPONENT) ? rotateBoard180deg(room.board) : room.board
      }))
      roomBroadcast(room, JSON.stringify({
          type: KEYWORDS.USERS
      }))
    }
  }
}

function socketHandler(socket, req){
  let path = req.params[0]
  if(! rooms[path]) {
    let room = {}
    room.viewers = []
    room.board = copyArray(initialBoard, 2)
    room.lastTurn = false
    rooms[path] = room
  }
  socket.send(JSON.stringify(
    {
      type: KEYWORDS.STATUS,
      status: "connected"
    }
  ))
  socket.path = path
  socket.addEventListener("message", messageHandler)
}

export default socketHandler;

// keep socket clients alive
setInterval(()=>{
  for(let path in rooms){
    let room = rooms[path]
    // console.log(room)
    room?.owner?.send(JSON.stringify({
      type: KEYWORDS.PING
    }))
    room?.opponent?.send(JSON.stringify({
      type: KEYWORDS.PING
    }))
    for(let viewer of room.viewers){
      viewer?.send(JSON.stringify({
        type: KEYWORDS.PING
      }))
    }
  }
}, 10000)
