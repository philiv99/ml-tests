/// <reference path="../types/ml5.d.ts" />
import ClassifyImage from '../components/ClassifyImage/ClassifyImage';
import { aperture } from 'ionicons/icons';
import { ClassificationStatus } from '../helpers/Statuses'
import './Pages.css';

import React, { Component } from 'react'
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react'
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;
const ml5 = require('ml5');

export interface ClassificationProps {}

export interface ClassificationState {
  imageUrl: any,
  classifierStatus: ClassificationStatus,
  classifier: any
}

export default class ClassificationPage extends Component<ClassificationProps, ClassificationState> {
  
  constructor (props: ClassificationProps, state: ClassificationState) {
    super(props);

    this.state = {
      imageUrl: "",
      classifierStatus: ClassificationStatus.new,
      classifier: {}
    };
  
  }

  componentDidMount() {
    this.setState({ classifier: ml5.imageClassifier('MobileNet', () => { 
        this.setState({
          classifierStatus: ClassificationStatus.ready
        });
      })
    });
  }
  
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.setState({
      imageUrl: image.webPath
    })
  }

  IsClassifierReady = () => {
    return this.state.classifierStatus === ClassificationStatus.ready;
  }

  render () { 
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Classification</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard className="welcome-card">
            <IonCardHeader>
              <IonCardSubtitle>Classifying Image</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent> 
                <IonButton size="small" disabled={!this.IsClassifierReady()} onClick={() => this.takePicture()}>
                  <IonIcon icon={aperture} />
                </IonButton>
              <ClassifyImage imageUrl={this.state.imageUrl} classifier={this.state.classifier} />
            </IonCardContent>
          </IonCard>

        </IonContent>
      </IonPage>
    );
  }
};