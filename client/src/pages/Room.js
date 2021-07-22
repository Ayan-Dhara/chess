"use strict"
import PlayGround from "./room/PlayGround";
import NamePopUp from "./NamePopUp";

import React from 'react';
import {RoomContext} from "./room/context/RoomContext";

function Room(props) {
  return (
    <RoomContext>
      <PlayGround/>
      <NamePopUp/>
    </RoomContext>
  );
}
export default Room;
