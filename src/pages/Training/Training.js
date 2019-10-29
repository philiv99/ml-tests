import ClassifyImage from '../../components/ClassifyImage/ClassifyImage';
import { aperture } from 'ionicons/icons';
import ml5 from 'ml5';
import { ClassificationStatus } from '../../helpers/Statuses'

import React, { Component } from 'react'
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon
} from '@ionic/react'
import {Link} from 'react-router-dom'
import { Plugins, CameraResultType } from '@capacitor/core';
const { Camera } = Plugins;


class Training extends Component {

  constructor (props) {
    super(props);

    this.state = {
      image: "No Image",
      file: "",
      classifierStatus: ClassificationStatus.new
    };
    this.classifier = null;
  }

  componentDidMount() {
    this.classifier = ml5.imageClassifier('MobileNet', () => { 
      this.setState({classifierStatus: ClassificationStatus.ready});
    })
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

  render() {
    return (
        <IonContent>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Train Me</IonCardTitle>
            </IonCardHeader>
            <Link to="/"><IonButton color="primary">Home</IonButton></Link>
            <Link to="/about"><IonButton color="primary">About</IonButton></Link>
            <Link to="/settings"><IonButton color="primary">Settings</IonButton></Link>
          </IonCard>
          <IonCard>
            <IonButton size="small" disabled={!this.IsClassifierReady()} onClick={() => this.takePicture()}>
              <IonIcon icon={aperture} />
            </IonButton>
          </IonCard>
          <ClassifyImage imageUrl={this.state.imageUrl} classifier={this.classifier} />
        </IonContent>
    )
  }
}

export default Training;