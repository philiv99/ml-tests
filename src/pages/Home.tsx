import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
  } from '@ionic/react';
import { book } from 'ionicons/icons';
import React from 'react';
import './Home.css';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>ML Tests</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="welcome-card">
          <img src="/assets/shapes.svg" alt=""/>
          <IonCardHeader>
            <IonCardSubtitle>exploring ml algorithms</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
             See the menu for what's available. Check out the links below for background information.
            </p>
          </IonCardContent>
        </IonCard>

        <IonList lines="none">
          <IonListHeader>
            <IonLabel>Sources</IonLabel>
          </IonListHeader>
          <IonItem href="https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/#pre-trained-model" target="_blank">
            <IonIcon slot="start" color="medium" icon={book} />
            <IonLabel>Image classification</IonLabel>
          </IonItem>
          <IonItem href="https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/#transfer-learning" target="_blank">
            <IonIcon slot="start" color="medium" icon={book} />
            <IonLabel>Teach model new classifications</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
