let listenerCallback: Function = () => {
}
export let linkPopUpNeeded = true

export function register(func: Function) {
  listenerCallback = func
}

export function change(linkPopUp: any) {
  listenerCallback(linkPopUp);
  linkPopUpNeeded = linkPopUp
}
