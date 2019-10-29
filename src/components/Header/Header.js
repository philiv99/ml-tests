import React, { Component } from 'react'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react'

class Header extends Component {
  render() {
    return (
        <IonHeader>
          <IonToolbar>
            <IonTitle>Who, what, and why?</IonTitle>
          </IonToolbar>
        </IonHeader>
    )
  }
}

export default Header;