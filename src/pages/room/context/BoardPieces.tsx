let listenerCallback: Function = () => {
}
export let currentBoardPieces = []

export function register(func: Function) {
  listenerCallback = func
}

export function change(boardPieces: any) {
  listenerCallback(boardPieces);
  currentBoardPieces = boardPieces
}
