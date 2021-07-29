"use strict"
import "./styles/PlayGround.scss"
import ChessBoard from "./ChessBoard";
import {useEffect, useState} from "react";
import {getUserRole} from "./context/RoomContext";

function BoardSide({role}) {
  role = role || 'owner'
  const sideMarks = {
    'abc': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
    'cba': ['H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'],
    '123': ['1', '2', '3', '4', '5', '6', '7', '8'],
    '321': ['8', '7', '6', '5', '4', '3', '2', '1']
  }
  const sides = {
    owner: {
      classes: ['top', 'left', 'bottom', 'right'],
      marks: [sideMarks['abc'], sideMarks['321'], sideMarks['abc'], sideMarks['321']]
    },
    opponent: {
      classes: ['top', 'left', 'bottom', 'right'],
      marks: [sideMarks['cba'], sideMarks['123'], sideMarks['cba'], sideMarks['123']]
    },
    viewer: {
      classes: ['top', 'left', 'bottom', 'right'],
      marks: [sideMarks['abc'], sideMarks['321'], sideMarks['abc'], sideMarks['321']]
    },
  }
  return (
    <>
      {
        sides[role].classes.map((className, i) => {
          return (
            <div className={className} key={i}>
              {
                sides[role].marks[i].map((mark, i) => {
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
  const [role, setRole] = useState(getUserRole())
  useEffect(() => {
    if(!role){
      const intervalId = setInterval(()=>{
        if(getUserRole()){
          setRole(getUserRole())
          clearInterval(intervalId)
        }
      }, 100)
    }
  }, [role])
  return (
    <div className="play-ground">
      <ChessBoard/>
      <BoardSide role={role}/>
    </div>
  )
}

export default PlayGround;
