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

export const rooms = []
export function messageHandler(event){
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
          event.target.send(JSON.stringify({
            type: KEYWORDS.BOARD,
            board: initialBoard
          }))
        }
      }
      break;
    }
  }
}
