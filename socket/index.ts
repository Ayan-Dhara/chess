import {KEYWORDS} from "../src/KeyWords";
import sha256 from "sha256";
import WebSocket from "ws"
import {Request} from "express";
import * as fs from "fs";
import fsExtra from "fs-extra"
import nodePath from "path"

export interface User {
  socket: WebSocket
  id: string
  name: string
  secret?: string
}

export interface Room {
  path: string
  lastTurn: boolean;
  owner?: User
  opponent?: User
  viewers: User[]
  board: Board
}

export interface Move {
  from: {
    x: number
    y: number
  }
  to: {
    x: number
    y: number
  }
}

export declare type Board = string[][];

const initialBoard: Board = [
  ["RL", "NL", "BL", "Q0", "K0", "BR", "NR", "RR"].map(c => "B" + c),
  ["P", "P", "P", "P", "P", "P", "P", "P"].map((c, i) => "B" + c + (i + 1)),
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"].map((c, i) => "W" + c + (i + 1)),
  ["RL", "NL", "BL", "Q0", "K0", "BR", "NR", "RR"].map(c => "W" + c)
]

const rooms: { [room_id: string]: Room } = {}

const socketPaths = new Map<WebSocket, string>()

const rotateBoard180deg = (board: Board) => {
  const newBoard: Board = []
  for (let i = 0; i < board.length; i++) {
    newBoard[i] = []
    for (let j = 0; j < board[i].length; j++) {
      newBoard[i][j] = board[7 - i][7 - j]
    }
  }
  return newBoard
}

// const copyObject = (obj: Object): Object => {
//   try {
//     const newObj: any = {...obj}
//     for (let key in newObj) {
//       newObj[key] = copyObject(newObj[key])
//     }
//     return newObj
//   } catch (e) {
//   }
//   return obj
// }

export interface PiecesMoves {
  [piece: string]: {
    move: number[][]
    attack?: number[][] // no attack => attack = move
    initial?: number[][] // no initial => initial = move
    type: number, // 1 - move once, 2 - first move twice then move once, 3 - no limit
  }
}

const pieceMoves: PiecesMoves = {
  K: {
    move: [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ],
    type: 3
  },
  Q: {
    move: [
      [-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]
    ],
    type: 1
  },
  R: {
    move: [
      [-1, 0], [0, -1], [0, 1], [1, 0],
    ],
    type: 1
  },
  B: {
    move: [
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ],
    type: 1
  },
  N: {
    move: [
      [-1, 2], [-1, -2], [1, 2], [1, -2], [-2, 1], [-2, -1], [2, 1], [2, -1]
    ],
    type: 0
  },
  P: {
    move: [
      [-1, 0]
    ],
    initial: [
      [-2, 0], [-1, 0]
    ],
    attack: [
      [-1, 1], [-1, -1]
    ],
    type: 3
  }
}

export const writeFile = (path: string, data: string) => {
  fsExtra.mkdirsSync(nodePath.dirname(path))
  fs.writeFileSync(path, data)
}

export const appendFile = (path: string, data: string) => {
  fsExtra.mkdirsSync(nodePath.dirname(path))
  fs.appendFileSync(path, data)
}

const copyArray = (arr: any[], level: number) => {
  if (level < 1)
    return arr
  try {
    const newArr = [...arr]
    for (let i in newArr) {
      newArr[i] = copyArray(newArr[i], level - 1)
    }
    return newArr
  } catch (e) {
  }
  return arr
}

const validMove = (board: Board, move: Move, moveByOwner: boolean) => {
  const i = Number(move.from.x)
  const j = Number(move.from.y)
  const pieceType = board[i][j]
  if (!pieceType[1])
    return false
  if (moveByOwner) {
    if (pieceType[0] === 'B')
      return false
  } else if (pieceType[0] === 'W')
    return false
  const moves: number[][] = pieceMoves[pieceType[1]].move
  switch (pieceMoves[pieceType[1]].type) {
    case 0: {
      for (let [dx, dy] of moves) {
        let x = i + dx
        let y = j + dy
        if (x > -1 && y > -1 && x < 8 && y < 8) {
          if (haveSameSidePiece(board, pieceType, x, y)) {
            continue
          }
          if (x === move.to.x && y === move.to.y)
            return true
        }
      }
      break
    }
    case 1: {
      for (let [dx, dy] of moves) {
        let x = i + dx
        let y = j + dy
        while (x > -1 && y > -1 && x < 8 && y < 8) {
          if (haveSameSidePiece(board, pieceType, x, y)) {
            break
          }
          if (haveOtherSidePiece(board, pieceType, x, y)) {
            if (x === move.to.x && y === move.to.y)
              return true
            break
          }
          if (x === move.to.x && y === move.to.y)
            return true
          x = x + dx
          y = y + dy
        }
      }
      break
    }
    default: {
      switch (pieceType[1]) {
        case "K": {
          // primary move
          for (let [dx, dy] of moves) {
            let x = i + dx
            let y = j + dy
            if (x > -1 && y > -1 && x < 8 && y < 8) {
              if (haveSameSidePiece(board, pieceType, x, y)) {
                continue
              }
              if (haveOtherSidePiece(board, pieceType, x, y)) {
                if (x === move.to.x && y === move.to.y)
                  return true
              } else {
                if (x === move.to.x && y === move.to.y)
                  return true
                x = x + dx
                y = y + dy
              }
            }
          }
          // castling
          break
        }
        case "P": {
          if (i === 6) {
            // initial move
            for (let [dx, dy] of pieceMoves["P"]?.initial || pieceMoves["P"].move) {
              let x = i + dx
              let y = j + dy
              if (x > -1 && y > -1 && x < 8 && y < 8) {
                if (haveSameSidePiece(board, pieceType, x, y)) {
                  break
                }
                if (haveOtherSidePiece(board, pieceType, x, y)) {
                  break
                }
                if (x === move.to.x && y === move.to.y)
                  return true
              }
            }
          } else {
            // primary move
            for (let [dx, dy] of pieceMoves["P"].move) {
              let x = i + dx
              let y = j + dy
              if (x > -1 && y > -1 && x < 8 && y < 8) {
                if (haveSameSidePiece(board, pieceType, x, y)) {
                  continue
                }
                if (haveOtherSidePiece(board, pieceType, x, y)) {
                  continue
                }
                if (x === move.to.x && y === move.to.y)
                  return true
              }
            }
          }
          // cut move
          for (let [dx, dy] of pieceMoves["P"].attack || pieceMoves["P"].move) {
            let x = i + dx
            let y = j + dy
            if (x > -1 && y > -1 && x < 8 && y < 8) {
              if (haveOtherSidePiece(board, pieceType, x, y)) {
                if (x === move.to.x && y === move.to.y)
                  return true
                else {
                }
              }
            }
          }
          break
        }
      }
    }
  }
  return false
}

const haveSameSidePiece = (board: Board, type: string, x: number, y: number) => {
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++)
      if (x === i && y === j && board[i][j][0] && board[i][j][0] === type[0])
        return true
  return false
}

const haveOtherSidePiece = (board: Board, type: string, x: number, y: number) => {
  for (let i = 0; i < 8; i++)
    for (let j = 0; j < 8; j++)
      if (x === i && y === j && board[i][j][0] && board[i][j][0] !== type[0])
        return true

  return false
}

const moveSafely = (board: Board, move: Move) => {
  board[move.to.x][move.to.y] = board[move.from.x][move.from.y]
  board[move.from.x][move.from.y] = ''
}

const sendAndSaveRoom = (room: Room, board: Board) => {
  room?.opponent?.socket.send(JSON.stringify({
    type: KEYWORDS.BOARD,
    board: rotateBoard180deg(board)
  }))
  const data = JSON.stringify({
    type: KEYWORDS.BOARD,
    board: board
  })
  room?.owner?.socket.send(data)
  for (let viewer of room.viewers) {
    viewer?.socket.send(data)
  }
  const roomJson = JSON.stringify({
    ...room,
    owner: {
      ...room.owner,
      socket: null
    },
    opponent: {
      ...room.opponent,
      socket: null
    },
    viewers: []
  }, null, 2)
  writeFile(`./data${room.path}.json`, roomJson)
}
const getRoom = (path: string): Room => {
  const roomPath = `./data${path}.json`
  if (fs.existsSync(roomPath))
    try {
      return JSON.parse(fs.readFileSync(roomPath, 'utf8'))
    } catch (e) {
    }
  return {
    path,
    board: copyArray(initialBoard, 2),
    lastTurn: false,
    viewers: []
  }
}

const roomBroadcast = (room: Room, data: any) => {
  room?.owner?.socket?.send(data)
  room?.opponent?.socket?.send(data)
  for (let viewer of room.viewers) {
    viewer?.socket?.send(data)
  }
}

const messageHandler = (event: WebSocket.MessageEvent) => {
  const socket = event.target
  let data: any = {
    type: KEYWORDS.ERROR,
  }
  try {
    if (typeof event.data === "string") {
      data = JSON.parse(event.data);
    }
  } catch (e) {
  }
  const message = data

  switch (message.type) {
    case KEYWORDS.MOVE: {
      const room = rooms[socketPaths.get(event.target) || "<default>"]
      if (room.owner?.socket !== socket && room.opponent?.socket !== socket)
        return;

      // chance verification
      const moveByOwner = (socket === room.owner?.socket)
      if (moveByOwner === room.lastTurn)
        return

      // try to move
      const move = message[KEYWORDS.MOVE]
      const board = room.board
      if (validMove((socket === room.opponent?.socket) ? rotateBoard180deg(board) : board, move, moveByOwner)) {
        room.lastTurn = moveByOwner
        if (socket === room.opponent?.socket) {
          move.from.x = 7 - move.from.x
          move.from.y = 7 - move.from.y
          move.to.x = 7 - move.to.x
          move.to.y = 7 - move.to.y
        }
        moveSafely(board, move)
        sendAndSaveRoom(room, board)
      }
      break;
    }
    case KEYWORDS.CONNECT: {
      const userID = message.userID
      const userName = message.userName
      if (!userID) {
        socket.send(JSON.stringify({
          type: KEYWORDS.CREATE_ID,
          userID: sha256("User_" + Date.now() + "." + process.hrtime()[1])
        }))
        break;
      }
      if (!userName) {
        socket.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.NO_NAME
        }))
        break;
      }
      const room = rooms[socketPaths.get(socket) || "<default>"]

      if (!room.owner?.id) {
        room.owner = {
          socket,
          id: userID,
          name: userName
        }
      } else if (room.owner.id === userID) {
        room.owner.socket?.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.CLOSED
        }))
        room.owner.socket = socket
      } else if (!room.opponent?.id) {
        room.opponent = {
          socket,
          id: userID,
          name: userName
        }
      } else if (room.opponent.id === userID) {
        room.opponent.socket?.send(JSON.stringify({
          type: KEYWORDS.STATUS,
          status: KEYWORDS.CLOSED
        }))
        room.opponent.socket = socket
      } else {
        room.viewers.push({
          socket,
          id: userID,
          name: userName
        })
      }

      socket.send(JSON.stringify({
        type: KEYWORDS.INITIATE,
        role: room.owner.socket === socket ? KEYWORDS.OWNER : room.opponent?.socket === socket ? KEYWORDS.OPPONENT : KEYWORDS.VIEWER,
        board: room.opponent?.socket === socket ? rotateBoard180deg(room.board) : room.board
      }))
      roomBroadcast(room, JSON.stringify({
        type: KEYWORDS.USERS
      }))
    }
  }
}

const index = (socket: WebSocket, req: Request) => {
  let path = req.params[0]
  socketPaths.set(socket, path)
  if (!rooms[path])
    rooms[path] = getRoom(path)

  socket.send(JSON.stringify({
    type: KEYWORDS.STATUS,
    status: "connected"
  }))
  socket.addEventListener("message", messageHandler)
}

export default index;

// keep socket clients alive
setInterval(() => {
  for (let path in rooms) {
    let room = rooms[path]
    room?.owner?.socket.send(JSON.stringify({
      type: KEYWORDS.PING
    }))
    room?.opponent?.socket.send(JSON.stringify({
      type: KEYWORDS.PING
    }))
    for (let viewer of room.viewers) {
      viewer?.socket.send(JSON.stringify({
        type: KEYWORDS.PING
      }))
    }
  }
}, 10000)
