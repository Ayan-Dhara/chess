"use strict"

import './styles/NamePopUp.scss'

import React, {useState} from 'react';

function NamePopUp() {
  const [name, setName] = useState(localStorage.getItem("userName") || "")
  const changeName = (event: any) => {
    setName(event.target?.value)
  }
  const saveName = () => {
    if (!name) return
    localStorage.setItem("userName", name)
    fetch("/create", {
      method: "POST"
    })
      .then(res => res.json())
      .then(json => {
        window.location.pathname = `room/${json.room}`
      })
  }
  return (
    <div className="popupBackground">
      <div className="namePopup">
        <div className="heading">
          Enter Your Name
        </div>
        <input type="text" placeholder="Your Name" onChange={changeName} value={name}/>
        <button onClick={saveName}>Create Room</button>
      </div>
    </div>
  );
}

export default NamePopUp;
