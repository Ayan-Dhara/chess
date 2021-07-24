"use strict"

import './styles/NamePopUp.scss'

import React, {useState} from 'react';

function NamePopUp() {
  const [name, setName] = useState("")
  const changeName = (event) => {
    setName(event.target.value)
  }
  const saveName = ()=>{
    localStorage.setItem("userName", name)
    window.location.reload()
  }
  return (
    <div className="popupBackground">
      <div className="namePopup">
        <div>
          Enter Your Name
        </div>
        <input type="text" onChange={changeName} value={name}/>
        <button onClick={saveName}>Go >></button>
      </div>
    </div>
  );
}

export default NamePopUp;
