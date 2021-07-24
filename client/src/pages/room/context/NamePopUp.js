"use strict"

let listenerCallback = ()=>{}
export let namePopUpNeeded = false

export function register(func){
  listenerCallback = func
}

export function change(namePopUp){
  listenerCallback(namePopUp);
  namePopUpNeeded = namePopUp
}
