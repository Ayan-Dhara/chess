"use strict"

let listenerCallback = ()=>{}
export let linkPopUpNeeded = true

export function register(func){
  listenerCallback = func
}

export function change(linkPopUp){
  listenerCallback(linkPopUp);
  linkPopUpNeeded = linkPopUp
}
