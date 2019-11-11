/// <reference path="../types/ml5.d.ts" />
//import ClassifyImage from '../components/ClassifyImage/ClassifyImage';
import { aperture } from 'ionicons/icons';
//import { ClassificationStatus } from '../helpers/Statuses'
import './Pages.css';

import ml5config from '../configuration/ml5';

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
import { Plugins, CameraResultType, CameraSource, CameraDirection  } from '@capacitor/core';
import Store from '../services/storage'
const { Camera } = Plugins;
const ml5 = require('ml5');

export interface TransferLearningProps {}

interface LabelOption {
  id: number;
  label: string;
}

interface TrainingExample {
  label: number,
  image: any
}

interface Prediction {
  label: string;
  confidence: number;
  count: number;
}

export interface TransferLearningState {
  imageUrl: any,
  labelOptions: Array<LabelOption>,
  selectedLabel: number,
  logText: string
}

let store = new Store();

export default class TransferLearningPage extends Component<TransferLearningProps, TransferLearningState>  {

  LogTextArea: any;
  labelInput: any;
  imageRef: any;
  LABELS: string;
  knn: any;
  featureExtractor: any;
  classifier: any;
  timer: any;
  image: any;
  predictions: Array<Prediction>;
  trainingExamples: Array<TrainingExample>;
  exampleCount: number;

  constructor (props:{}) {
    super(props)
    this.state = {
      imageUrl: "img/Aidan2.JPG",
      labelOptions: [],
      selectedLabel: 0,
      logText: "Log..."
    }
    this.LABELS = "labels"
    this.predictions = new Array<Prediction>(ml5config.num_classes);
    this.trainingExamples = new Array<TrainingExample>();
    this.labelInput = React.createRef();
    this.LogTextArea = React.createRef();
    this.imageRef = React.createRef();
    this.exampleCount = 0;
    store.setObject(this.LABELS, []);
    this.log(`ml5 version: ${ml5.version}`);
    this.loadClassifierAndModel();

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
    if (!this.labelInput) return;
    let newLabel = this.labelInput.current.value;
    if (newLabel === "") return;
    let labels = await store.getObject(this.LABELS) as Array<string>;
    if (!labels) labels = [];
    if (!labels.find((element) => element === newLabel) && labels.length<ml5config.num_classes) {
      labels.push(newLabel);
      store.setObject(this.LABELS, labels);  
      let newLabelOptions = this.state.labelOptions;
      newLabelOptions.push({id: labels.length, label: newLabel})
      this.setState({
        labelOptions: newLabelOptions,
        selectedLabel: labels.length
      })
      this.labelInput.current.value = "";
      ml5config.classes.push(newLabel);
    }
  };

  async loadClassifierAndModel() {
    this.featureExtractor = await ml5.featureExtractor("MobileNet");
    this.classifier = await this.featureExtractor.classification();
    this.log("Classifier and Model loaded");
  }

  async classifierResults(results:any) {
    this.log(`classifierResults: ${JSON.stringify(results)}`);
    let labels = await store.getObject(this.LABELS) as Array<string>;
    let idxLabel = results[0].label - 1;
    this.log(`Predicted label: (${results[0].label}) ${labels[idxLabel]}`)
    this.log(`Prediction confidence: ${results[0].confidence}`)
  }
  async predict() {
    let currentImage = this.imageRef.current;
    if (!currentImage) {
      this.log("Predict: No image selected");
      return;
    }
    try {
      this.classifier.classify(currentImage).then((results:any) => this.classifierResults(results));
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
    let labels = await store.getObject(this.LABELS) as Array<string>;
    let selectedLabel = this.state.selectedLabel;
    let idxLabel = this.state.selectedLabel-1;
    let currentImage = this.imageRef.current;
    if (selectedLabel == 0 || !currentImage) {
      this.log("addExample: no label selected or no image available");
      return;
    }
    try {
      await this.classifier.addImage(currentImage, selectedLabel, (pa:any)=>{this.log(`addExample: labeled [${idxLabel}:${labels[idxLabel]}]`);
        }
      );  
    } catch (e) {
      this.log(`addExample error: [${e}]`)
    }
  }

  async train() {
    this.log("Training...");
    try {
      await this.classifier.train((loss:any)=>{});
      this.log("Trained");
    } catch (e) {
      this.log(`Training error: [${e}]`)
    }
  }


  onLabelSelected = (selectedObject: React.ChangeEvent<HTMLSelectElement>) => {
    var newLabel: number = Number(selectedObject.currentTarget.value);
    if (newLabel) this.setState({selectedLabel: newLabel})
  }

  render () { 
    const isSelectedText = (object: LabelOption) => this.state.selectedLabel==object.id?'selected':'';
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
                {/* <canvas id="image-canvas" width="224" height="224"></canvas>
                <div id="measure"></div> */}
            </IonCardContent>
          </IonCard>
          
          <IonCard className="welcome-card">
              <IonItem>
                <select  value={this.state.selectedLabel} onChange={(e) => this.onLabelSelected(e)}>
                  {this.state.labelOptions.map((object, i) => {
                    return (
                      <option key={object.id} value={object.id}>
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