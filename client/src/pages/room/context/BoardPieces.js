"use strict"
import {setBoardReady} from "./RoomContext";

let listenerCallback = ()=>{}
export let currentBoardPieces = []

export function register(func){
  listenerCallback = func
  setBoardReady(true)
}

export function change(boardPieces){
  listenerCallback(boardPieces);
  currentBoardPieces = boardPieces
}
