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
  IonModal,
  IonCardContent,
  IonInput,
  IonTextarea,
  IonItem
} from '@ionic/react'
import { aperture, settings } from 'ionicons/icons';
import { Plugins, CameraResultType, CameraSource, CameraDirection  } from '@capacitor/core';
import './Pages.css';
import { TLModel, TLLabelOption } from '../Models/TLModel'
import Settings from '../components/Settings'
import FileManager from '../services/FileManager'
const { Camera } = Plugins;

export interface TransferLearningProps {}

export interface TransferLearningState {
  imageUrl: any,
  model: TLModel,
  selectedLabel: string,
  logText: string,
  modelLoaded: boolean,
  showSettings: boolean
}

export default class TransferLearningPage extends Component<TransferLearningProps, TransferLearningState>  {

  logTextAreaRef: any;
  labelInputRef: any;
  imageRef: any;

  constructor (props:{}) {
    super(props)
    this.state = {
      imageUrl: "",
      model: new TLModel(),
      selectedLabel: "",
      logText: "Log...",
      modelLoaded: false,
      showSettings: false
    }
    this.labelInputRef = React.createRef();
    this.logTextAreaRef = React.createRef();
    this.imageRef = React.createRef();

  }

  componentDidMount () {
    this.state.model.createModel()
      .then(() => { this.log("Classifier and Model loaded"); this.setState({modelLoaded: true}) }, 
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
      this.setState({ imageUrl: result.webPath })
    });
  }

  log(msg:string) {
    if (this.logTextAreaRef && this.logTextAreaRef.current) {
      this.setState({ logText: this.logTextAreaRef.current.innerText + '\n' + msg});
    } else {
      console.log(msg);
    }
  }

  async addLabel() {
    if (!this.labelInputRef) { return this.log(`No label provided`); }
    let newLabel = this.labelInputRef.current.value;
    if (newLabel === ""){ return this.log(`No label provided`); }
    if (this.state.model.addLabel(newLabel) > 0) {
      this.setState({selectedLabel: newLabel})
      this.labelInputRef.current.value = "";
    } else {
      this.log(`Label already exists`);
    }
  }

  predict() {
    let currentImage = this.imageRef.current;
    if (!currentImage) { return this.log("Predict: No image selected"); }
    try {
      this.state.model.predict(currentImage)
        .then((results:any) => this.log(`Prediction: ${JSON.stringify(results)}`),
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
    this.log(currentImage)
    if (selectedLabel == "" || !currentImage) {
      this.log("addExample: no label selected or no image available");
      return;
    }
    try {
      this.state.model.addTrainingExample(currentImage, selectedLabel)
          .then(() => this.log(`addExample:labeled [${selectedLabel}]`),
                (err:any) => this.log(`addExample failed: ${err}`));
    } catch (e) {
      this.log(`addExample error: [${e}]`)
    }
  }

  async train() {
    const fileMgr = new FileManager();
    this.log("Writing file: "+fileMgr.fileWrite());
    this.log("Reading dir: "+fileMgr.readdir(''))
    this.log(JSON.stringify(this.state.model.getTrainingHistory()))
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
          <IonModal isOpen={this.state.showSettings}>
            <Settings />
            <IonButton onClick={() => { this.setState({ showSettings: false} ) }}>Close Modal</IonButton>
          </IonModal>
          <IonCard className="welcome-card">
            <IonCardContent> 
                <IonButton size="small" onClick={() => this.takePicture()} disabled={!this.state.modelLoaded}>
                  <IonIcon icon={aperture} />
                </IonButton>
                <IonButton size="small" onClick={() => this.setState({showSettings: true})} >
                  <IonIcon icon={settings} />
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
              <IonInput ref={this.labelInputRef} type="text" maxlength={25} placeholder="Enter new label">
                <IonButton size="small" onClick={() => this.addLabel()}>Add Label</IonButton>
              </IonInput>
              <IonButton size="small" onClick={() => this.addExample()} disabled={!this.state.modelLoaded}>Add Example</IonButton>
              <IonButton size="small" onClick={() => this.train()} disabled={!this.state.modelLoaded}>Train</IonButton>
              <IonButton size="small" onClick={() => this.predict()} disabled={!this.state.modelLoaded}>Predict</IonButton>
            </IonCard>
            <IonCard className="welcome-card">
              <IonTextarea ref={this.logTextAreaRef} >{this.state.logText}</IonTextarea>
            </IonCard>
        </IonContent>
      </IonPage>
    );
  }
};