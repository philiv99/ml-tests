/// <reference path="../types/ml5.d.ts" />

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
  IonCardContent,
  IonInput,
  IonTextarea,
  IonItem
} from '@ionic/react'
import { aperture } from 'ionicons/icons';
import { Plugins, CameraResultType, CameraSource, CameraDirection  } from '@capacitor/core';
import './Pages.css';
import Store from '../services/storage'
import { TLModel, TLLabelOption } from '../Models/TLModel'
const { Camera } = Plugins;

export interface TransferLearningProps {}

export interface TransferLearningState {
  imageUrl: any,
  model: TLModel,
  selectedLabel: string,
  logText: string
}

let store = new Store();

export default class TransferLearningPage extends Component<TransferLearningProps, TransferLearningState>  {

  LogTextArea: any;
  labelInput: any;
  imageRef: any;

  constructor (props:{}) {
    super(props)
    this.state = {
      imageUrl: "",
      model: new TLModel(),
      selectedLabel: "",
      logText: "Log..."
    }
    this.labelInput = React.createRef();
    this.LogTextArea = React.createRef();
    this.imageRef = React.createRef();

  }

  componentDidMount () {
    this.state.model.createModel()
      .then(() => this.log("Classifier and Model loaded"), 
            (err:any) => this.log(`createModel failed: ${err}`));
  }
  
  compareWith = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };
  
  async takePicture() {
    Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      resultType: CameraResultType.Uri
    }).then ((result) =>{
      this.setState({
        imageUrl: result.webPath
      })
    });
  }

  log(msg:string) {
    if (this.LogTextArea && this.LogTextArea.current) {
      var newText = this.LogTextArea.current.innerText + '\n' + msg ;
      this.setState({ logText:newText});
    } else {
      console.log(msg);
    }
  }

  async addLabel() {
    if (!this.labelInput) { this.log(`No label provided`);return; }
    let newLabel = this.labelInput.current.value;
    if (newLabel === ""){ this.log(`No label provided`);return; }
    if (this.state.model.addLabel(newLabel) > 0) {
      this.setState({selectedLabel: newLabel})
      this.labelInput.current.value = "";
    } else {
      this.log(`Label already exists`);
    }
  };

  async classifierResults(results:any) {
    this.log(`classifierResults: ${JSON.stringify(results)}`);
  }

  predict() {
    let currentImage = this.imageRef.current;
    if (!currentImage) {
      this.log("Predict: No image selected");
      return;
    }
    try {
      this.state.model.predict(currentImage)
        .then((results:any) => this.classifierResults(results),
              (err:any) => this.log(`Prediction failed: ${err}`));
    } catch (e) {
      this.log(`Predict error: [${e}]`)
    }
  }
  
  ResizeImage(e: any) {
    const MAX: number = 224
    var img = this.imageRef.current;
    img.size(MAX, MAX);
  }

  async addExample() {
    let selectedLabel = this.state.selectedLabel;
    let currentImage = this.imageRef.current;
    if (selectedLabel == "" || !currentImage) {
      this.log("addExample: no label selected or no image available");
      return;
    }
    try {
      this.state.model.addTrainingExample(currentImage, selectedLabel)
          .then((pa:any) => this.log(`addExample:labeled [${selectedLabel}]`),
                (err:any) => this.log(`addExample failed: ${err}`));
    } catch (e) {
      this.log(`addExample error: [${e}]`)
    }
  }

  async train() {
    try {
      this.state.model.train((loss:any)=>{})
         .then(() => this.log("Trained"),
               (err:any) => this.log(`train failed: ${err}`));
    } catch (e) {
      this.log(`Training error: [${e}]`)
    }
  }

  onLabelSelected = (selectedObject: React.ChangeEvent<HTMLSelectElement>) => {
    var newLabel = selectedObject.currentTarget.value;
    if (newLabel) this.setState({selectedLabel: newLabel})
  }

  render () { 
    const isSelectedText = (object: TLLabelOption) => this.state.selectedLabel==object.label?'selected':'';
    return (
      <IonPage> 
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Transfer Learning</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonCard className="welcome-card">
            <IonCardContent> 
                <IonButton size="small" onClick={() => this.takePicture()}>
                  <IonIcon icon={aperture} />
                </IonButton>
                <img ref={this.imageRef} onLoad={this.ResizeImage.bind(this)} src={this.state.imageUrl} id="image" alt="" />
            </IonCardContent>
          </IonCard>
          
          <IonCard className="welcome-card">
              <IonItem>
                <select  value={this.state.selectedLabel} onChange={(e) => this.onLabelSelected(e)}>
                  {this.state.model.labels.map((object, i) => {
                    return (
                      <option key={`label${i}`} value={object.label}>
                        {object.label}
                      </option>
                    );
                  })}>
                </select>
              </IonItem>
              <IonInput ref={this.labelInput} type="text" maxlength={25} placeholder="Enter new label">
                <IonButton size="small" onClick={() => this.addLabel()}>Add Label</IonButton>
              </IonInput>
              <IonButton size="small" onClick={() => this.addExample()}>Add Example</IonButton>
              <IonButton size="small" onClick={() => this.train()}>Train</IonButton>
              <IonButton size="small" onClick={() => this.predict()}>Predict</IonButton>
            </IonCard>
            <IonCard className="welcome-card">
              <IonTextarea ref={this.LogTextArea} >{this.state.logText}</IonTextarea>
            </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};