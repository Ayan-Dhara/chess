"use strict"
import React from 'react';
import Context from "./context/RoomContext";

const pieceMap = {
  BR:14,
  BN:16,
  BB:15,
  BQ:13,
  BK:12,
  BP:17,
  WR:20,
  WN:22,
  WB:21,
  WQ:19,
  WK:18,
  WP:23
}

//9800+14,16,15,12,13,15,16,14,
//     17,17,17,17,17,17,17,17,
//     23,23,23,23,23,23,23,23,
//     20,22,21,18,19,21,22,20

function ChessPieces(props) {
  const state = React.useContext(Context);
  return (
    <>
      {
        state?.pieces?.map((arr, i)=>{
          return <React.Fragment key={i}>
            {
              arr.map((piece, j)=>{
                if(!piece)
                  return ""
                return <div key={piece}
                  style={{'--i':i, '--j':j}}
                  data-i={i} data-j={j}
                  data-piece={piece}
                  className="chess-piece"
                  onClick={state.pieceClick}
                >
                  {
                    String.fromCharCode(9800 + pieceMap[`${piece[0]}${piece[1]}`])
                  }
                </div>
              })
            }
          </React.Fragment>
        })
      }
    </>
  );
}

export default ChessPieces;
