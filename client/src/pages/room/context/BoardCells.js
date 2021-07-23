"use strict"
import {setBoardReady} from "./RoomContext.js";

let listenerCallback = ()=>{}
export let currentBoardCells = [...Array(8)].map(()=>[...Array(8)])

export function register(func){
  listenerCallback = func
  setBoardReady(true)
}

export function change(boardCells){
  listenerCallback(boardCells);
  currentBoardCells = boardCells
}
