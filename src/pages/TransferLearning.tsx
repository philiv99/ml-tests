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
    this.image = await Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
    this.setState({
      imageUrl: this.image.webPath
    })
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
    // if (results && results.length>0) {
    //   for(let i=0; i++; i<results.length) {
    //     let result = results[i];
    //     let idxLabel = result.label - 1;
    //     this.log(`Predicted label: (${result.label}) ${labels[idxLabel]}`)
    //     this.log(`Prediction confidence: ${result.confidence}`)
    //   }
    // }
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
      await this.classifier.addImage(currentImage, selectedLabel, 
        (pa:any)=>{
          this.log(`addExample: added image with label [${labels[idxLabel]}] [${JSON.stringify(pa)}]`);
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
                 <img ref={this.imageRef} src={this.state.imageUrl} id="image" alt="" />
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

// // Number of classes to classify
// const NUM_CLASSES = 2;
// // Webcam Image size. Must be 227.
// const IMAGE_SIZE = 227;
// // K value for KNN
// const TOPK = 10;

// const classes = ["Left", "Right"];
// let testPrediction = false;
// let training = true;
// let video = document.getElementById("webcam");

// class App {
//   constructor() {
//     this.infoTexts = [];
//     this.training = -1; // -1 when no class is being trained
//     this.recordSamples = false;

//     // Initiate deeplearn.js math and knn classifier objects
//     this.loadClassifierAndModel();
//     this.initiateWebcam();
//     this.setupButtonEvents();
//   }

//   async loadClassifierAndModel() {
//     this.knn = knnClassifier.create();
//     this.mobilenetModule = await mobilenet.load();
//     console.log("model loaded");

//     this.start();
//   }

//   initiateWebcam() {
//     // Setup webcam
//     navigator.mediaDevices
//       .getUserMedia({ video: true, audio: false })
//       .then(stream => {
//         video.srcObject = stream;
//         video.width = IMAGE_SIZE;
//         video.height = IMAGE_SIZE;
//       });
//   }

//   setupButtonEvents() {
//     for (let i = 0; i < NUM_CLASSES; i++) {
//       let button = document.getElementsByClassName("button")[i];

//       button.onmousedown = () => {
//         this.training = i;
//         this.recordSamples = true;
//       };
//       button.onmouseup = () => (this.training = -1);

//       const infoText = document.getElementsByClassName("info-text")[i];
//       infoText.innerText = " No examples added";
//       this.infoTexts.push(infoText);
//     }
//   }

//   start() {
//     if (this.timer) {
//       this.stop();
//     }
//     this.timer = requestAnimationFrame(this.animate.bind(this));
//   }

//   stop() {
//     cancelAnimationFrame(this.timer);
//   }

//   async animate() {
//     if (this.recordSamples) {
//       // Get image data from video element
//       const image = tf.browser.fromPixels(video);

//       let logits;
//       // 'conv_preds' is the logits activation of MobileNet.
//       const infer = () => this.mobilenetModule.infer(image, "conv_preds");

//       // Train class if one of the buttons is held down
//       if (this.training != -1) {
//         logits = infer();

//         // Add current image to classifier
//         this.knn.addExample(logits, this.training);
//       }

//       const numClasses = this.knn.getNumClasses();

//       if (testPrediction) {
//         training = false;
//         if (numClasses > 0) {
//           // If classes have been added run predict
//           logits = infer();
//           const res = await this.knn.predictClass(logits, TOPK);

//           for (let i = 0; i < NUM_CLASSES; i++) {
//             // The number of examples for each class
//             const exampleCount = this.knn.getClassExampleCount();

//             // Make the predicted class bold
//             if (res.classIndex == i) {
//               this.infoTexts[i].style.fontWeight = "bold";
//             } else {
//               this.infoTexts[i].style.fontWeight = "normal";
//             }

//             if (exampleCount[i] > 0) {
//               this.infoTexts[i].innerText = ` ${
//                 exampleCount[i]
//               } examples - ${res.confidences[i] * 100}%`;
//             }
//           }
//         }
//       }

//       if (training) {
//         // The number of examples for each class
//         const exampleCount = this.knn.getClassExampleCount();

//         for (let i = 0; i < NUM_CLASSES; i++) {
//           if (exampleCount[i] > 0) {
//             this.infoTexts[i].innerText = ` ${exampleCount[i]} examples`;
//           }
//         }
//       }

//       // Dispose image when done
//       image.dispose();
//       if (logits != null) {
//         logits.dispose();
//       }
//     }
//     this.timer = requestAnimationFrame(this.animate.bind(this));
//   }
// }

// document
//   .getElementsByClassName("test-predictions")[0]
//   .addEventListener("click", function() {
//     testPrediction = true;
//   });

// new App();
