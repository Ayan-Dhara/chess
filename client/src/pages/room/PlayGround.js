"use strict"
import "./styles/PlayGround.scss"
import ChessBoard from "./ChessBoard";

function BoardSide(){
  const sides = [{
    className: "top",
    marks: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  }, {
    className: "bottom",
    marks: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  }, {
    className: "left",
    marks: ['1', '2', '3', '4', '5', '6', '7', '8']
  }, {
    className: "right",
    marks: ['1', '2', '3', '4', '5', '6', '7', '8']
  }
  ]
  return (
    <>
      {
        sides.map((item, i) => {
          return (
            <div className={item.className} key={i}>
              {
                item.marks.map((mark, i) => {
                  return <div key={i}>{mark.toUpperCase()}</div>
                })
              }
            </div>
          )
        })
      }
    </>
  );
}

function PlayGround() {
  return (
    <div className="play-ground">
      <ChessBoard/>
      <BoardSide/>
    </div>
  )
}

export default PlayGround;
