"use strict"
import styles from "./styles/PlayGround.module.scss"

import React, {Component} from 'react';

const classNames = (...classes) => {
  return classes.join(" ")
}

class ChessCell extends Component {
  render() {
    return (
      <div className={styles.cell}/>
    );
  }
}

class ChessRow extends Component {
  render() {
    return (
      <div className={styles.row}>
        {[...Array(8)].map((a,i) => <ChessCell key={i}/>)}
      </div>
    );
  }
}

class ChessBoard extends Component {
  render() {
    return (
      <div className={classNames(styles.chessBoard, styles.cell)}>
        {[...Array(8)].map((a,i) => <ChessRow key={i}/>)}
      </div>
    );
  }
}

class BoardSide extends Component {
  render() {
    const sides = [{
        className: styles.top,
        marks: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
      }, {
        className: styles.bottom,
        marks: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
      }, {
        className: styles.left,
        marks: ['1', '2', '3', '4', '5', '6', '7', '8']
      }, {
        className: styles.right,
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
                  item.marks.map((mark,i)=>{
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
}

class PlayGround extends Component {
  render() {
    return (
      <div className={classNames("playground", styles.playGround)}>
        <ChessBoard/>
        <BoardSide/>
      </div>
    )
  }
}

export default PlayGround;
