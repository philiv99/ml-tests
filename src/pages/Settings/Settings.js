import React, { Component } from 'react'
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton
} from '@ionic/react'
import {Link} from 'react-router-dom'

class Settings extends Component {
  render() {
    return (
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Settings</IonCardTitle>
            </IonCardHeader>
            <Link to="/"><IonButton color="primary">Home</IonButton></Link>
            <Link to="/train"><IonButton color="primary">Train</IonButton></Link>
            <Link to="/about"><IonButton color="primary">About</IonButton></Link>
          </IonCard>
        </IonContent>
    )
  }
}

export default Settings;