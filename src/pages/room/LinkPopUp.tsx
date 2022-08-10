import './styles/NamePopUp.scss'

import React, {useState} from 'react';
import {change as changeLinkPopUp} from "./context/LinkPopUp";

function NamePopUp() {
  function copyLink() {
    const copyText: any = document.getElementById("link-to-copy");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Link copied to clipboard");
  }

  return (
    <div className="popupBackground">
      <div className="namePopup">
        <div className="heading">
          Copy The Link <br/>
          And Share
        </div>
        <input type="text" value={window.location.toString()} readOnly={true} id="link-to-copy"/>
        <div>
          <button onClick={copyLink}>Copy Link</button>
          ...
          <button onClick={() => changeLinkPopUp(false)}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default NamePopUp;
