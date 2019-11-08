import { IonButtons, IonContent, IonLabel, IonHeader, IonIcon, IonItem, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { image } from 'ionicons/icons';
import React from 'react';
import './Pages.css';

const ListPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>List</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <ListItems />
      </IonContent>
    </IonPage>
  );
};

const ListItems = () => {
  const pageLinks = [ 
    { key: 1, title: 'Select and classify an image', icon: image, url: '/Classification'},
    { key: 2, title: 'Transfer learning', icon: image, url: '/TransferLearning'} 
  ];

  const items = pageLinks.map(pageLink => {
    return (
      <IonItem key={pageLink.key}>
        <div className="item-note" slot="start">
              <IonItem routerLink={pageLink.url} routerDirection="none">
                <IonIcon slot="start" icon={pageLink.icon} />
                <IonLabel>{pageLink.title}</IonLabel>
              </IonItem>
        </div>
      </IonItem>
    );
  });

  return <IonList>{items}</IonList>;
};

export default ListPage;
