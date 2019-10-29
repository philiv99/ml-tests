import React from 'react';
import { IonMenu, IonHeader, IonToolbar, IonTitle, 
         IonContent, IonList, IonItem, IonIcon, 
         IonLabel, IonButtons, IonButton, IonMenuButton } from '@ionic/react';
  
class Menu extends React.Component {

  render() {
    return (
  <>
    <IonMenu side="start">
      <IonHeader>
        <IonToolbar translucent>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonItem>
            <IonIcon name="home" slot="start"></IonIcon>
            <IonLabel>Home</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="person" slot="start"></IonIcon>
            <IonLabel>Profile</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="chatbubbles" slot="start"></IonIcon>
            <IonLabel>Messages</IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon name="settings" slot="start"></IonIcon>
            <IonLabel>Settings</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>

    <div class="ion-page" main>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent class="ion-padding">
        <IonButton expand="block" onclick="openMenu()">Open Menu</IonButton>
      </IonContent>
    </div>
  </>
  )
}
}

export default Menu;