import React, { Component } from 'react'
import {
  IonFooter,
  IonToolbar,
  IonTitle
} from '@ionic/react'

class Footer extends Component {
  render() {
    return (
        <IonFooter>
          <IonToolbar>
            <IonTitle>InfoGoer.com</IonTitle>
          </IonToolbar>
        </IonFooter>
    )
  }
}

export default Footer;