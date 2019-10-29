import React, { Component } from 'react'
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton
} from '@ionic/react'
import {Link} from 'react-router-dom'

class NoPage extends Component {
  render() {
    return (
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>NoPage</IonCardTitle>
            </IonCardHeader>
            <Link to="/"><IonButton color="primary">Home</IonButton></Link>
            <Link to="/train"><IonButton color="primary">Train</IonButton></Link>
            <Link to="/about"><IonButton color="primary">About</IonButton></Link>
            <Link to="/settings"><IonButton color="primary">Settings</IonButton></Link>
          </IonCard>
        </IonContent>
    )
  }
}

export default NoPage;