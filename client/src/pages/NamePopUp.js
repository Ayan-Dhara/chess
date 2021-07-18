"use strict"

import React, {Component} from 'react';

import styles from './styles/NamePopUp.module.scss'

class NamePopUp extends Component {
  render() {
    return (
      <div className={styles.background}>
        <div className={styles.namePopup}>
          Enter Your Name
        </div>
      </div>
    );
  }
}

export default NamePopUp;
