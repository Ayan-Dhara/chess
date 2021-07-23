"use strict"
let listenerCallback = ()=>{}
export let currentBoardCells = [...Array(8)].map(()=>[...Array(8)])

export function register(func){
  listenerCallback = func
}

export function change(boardCells){
  listenerCallback(boardCells);
  currentBoardCells = boardCells
}
