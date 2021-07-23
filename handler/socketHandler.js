"use strict"

import {KEYWORDS} from "../client/src/KeyWords.js";

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

function messageHandler(event){
  const socket = event.target
  let data = {}
  try{
    data = JSON.parse(event.data);
  }catch(e){}
  const message = data

  switch(message.type){
    case KEYWORDS.REQUEST:{
      switch (message[KEYWORDS.REQUEST]){
        case KEYWORDS.BOARD:{
          socket.send(JSON.stringify({
            type: KEYWORDS.BOARD,
            board: initialBoard
          }))
        }
      }
      break;
    }
    case KEYWORDS.MOVE:{
      const move = message[KEYWORDS.MOVE]
      const board = [...initialBoard]// copyArray(initialBoard, 2)
      board[move.to.x][move.to.y] = board[move.from.x][move.from.y]
      board[move.from.x][move.from.y] = ''
      socket.send(JSON.stringify({
        type: KEYWORDS.BOARD,
        board: board
      }))
      break;
    }
  }
}

function socketHandler(socket, req){
  let path = req.params[0]
  if(! rooms[path]) {
    let room = {}
    room.viewers = []
    room.moves = []
    room.lastTurn = false
    room.ownersTurn = true
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
