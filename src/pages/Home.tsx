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
import { book, image, albums, school } from 'ionicons/icons';
import React from 'react';
import './Pages.css';

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
            <IonLabel>Sources (click the image to go to the page)</IonLabel>
          </IonListHeader>
          <IonItem>
            <IonItem routerLink='/Classification' routerDirection="none">
              <IonIcon slot="start" icon={albums} />
            </IonItem>
            <IonItem href="https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/#pre-trained-model" target="_blank">
              <IonIcon slot="start" color="medium" icon={book} />
              <IonLabel>Image classification</IonLabel>
            </IonItem>
          </IonItem>
          <IonItem>
            <IonItem routerLink='/TransferLearning' routerDirection="none">
              <IonIcon slot="start" icon={school} />
            </IonItem>
            <IonItem href="https://www.smashingmagazine.com/2019/09/machine-learning-front-end-developers-tensorflowjs/#transfer-learning" target="_blank">
              <IonIcon slot="start" color="medium" icon={book} />
              <IonLabel>Transfer learning</IonLabel>
            </IonItem>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
