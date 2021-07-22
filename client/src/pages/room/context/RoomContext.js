"use strict"
import React, {useReducer} from 'react'

import {KEYWORDS} from "../../../KeyWords";

const Context = React.createContext(undefined)
export default Context

const LOCAL_PORT = 5000
const socket = new WebSocket(`${window.location.protocol.replace("http", "ws")}//${window.location.hostname}:${(window.location.hostname==="localhost"||window.location.hostname.toString().startsWith("127.0.0"))?LOCAL_PORT:window.location.port}/ws${window.location.pathname}`)

let dispatchFunction = (action) => {}

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
      break
    }
    default:{
      console.log("Cannot identify message")
    }
  }
  return state
}

const requestMove = (ix, iy, fx, fy) =>{}

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
  const [state, dispatch] = useReducer(handleMessage, {requestMove}, e=>e)
  dispatchFunction = dispatch
  return (
    <Context.Provider value={state}>
      {children}
    </Context.Provider>
  )
}
