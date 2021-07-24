"use strict"

let listenerCallback = ()=>{}
export let currentBoardPieces = []

export function register(func){
  listenerCallback = func
}

export function change(boardPieces){
  listenerCallback(boardPieces);
  currentBoardPieces = boardPieces
}
