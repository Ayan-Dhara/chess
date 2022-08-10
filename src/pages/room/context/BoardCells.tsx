let listenerCallback: Function = () => {
}
export let currentBoardCells = [...Array(8)].map(() => [...Array(8)])

export function register(func: Function) {
  listenerCallback = func
}

export function change(boardCells: any) {
  listenerCallback(boardCells);
  currentBoardCells = boardCells
}
