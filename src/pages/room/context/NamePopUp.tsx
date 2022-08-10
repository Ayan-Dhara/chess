let listenerCallback: Function = () => {
}
export let namePopUpNeeded = false

export function register(func: Function) {
  listenerCallback = func
}

export function change(namePopUp: any) {
  listenerCallback(namePopUp);
  namePopUpNeeded = namePopUp
}
