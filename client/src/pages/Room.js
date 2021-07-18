"use strict"
import {Component} from "react";
import PlayGround from "./room/PlayGround";
import NamePopUp from "./NamePopUp";

class Room extends Component {
  render() {
    return (
      <>
        <PlayGround/>
        <NamePopUp/>
      </>
    );
  }
}
export default Room;
