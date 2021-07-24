"use strict"
import PlayGround from "./room/PlayGround";
import NamePopUp from "./room/NamePopUp";
import {namePopUpNeeded, register as registerNamePopUp} from "./room/context/NamePopUp";
import {linkPopUpNeeded, register as registerLinkPopUp} from "./room/context/LinkPopUp";

import React, {useState} from 'react';
import LinkPopUp from "./room/LinkPopUp";

function Room() {
  const [namePopUp, setNamePopUp] = useState(namePopUpNeeded)
  registerNamePopUp(setNamePopUp)
  const [linkPopUp, setLinkPopUp] = useState(linkPopUpNeeded)
  registerLinkPopUp(setLinkPopUp)
  return (
    <>
      <PlayGround/>
      {
        namePopUp? <NamePopUp/>:""
      }
      {
        linkPopUp? <LinkPopUp/>:""
      }
    </>
  );
}
export default Room;
