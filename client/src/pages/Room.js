"use strict"
import PlayGround from "./room/PlayGround";
import NamePopUp from "./room/NamePopUp";
import {namePopUpNeeded, register} from "./room/context/NamePopUp";

import React, {useState} from 'react';

function Room() {
  const [namePopUp, setNamePopUp] = useState(namePopUpNeeded)
  register(setNamePopUp)
  return (
    <>
      <PlayGround/>
      {
        namePopUp? <NamePopUp/>:""
      }
    </>
  );
}
export default Room;
