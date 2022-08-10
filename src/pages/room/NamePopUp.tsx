import './styles/NamePopUp.scss'

import React, {useState} from 'react';

function NamePopUp() {
  const [name, setName] = useState("")
  const changeName = (event: any) => {
    setName(event.target.value)
  }
  const saveName = () => {
    localStorage.setItem("userName", name)
    window.location.reload()
  }
  return (
    <div className="popupBackground">
      <div className="namePopup">
        <div className="heading">
          Enter Your Name
        </div>
        <input type="text" placeholder="Your Name" onChange={changeName} value={name}/>
        <button onClick={saveName}>Enter Room</button>
      </div>
    </div>
  );
}

export default NamePopUp;
