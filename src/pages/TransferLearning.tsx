
import ClassifyImage from '../components/ClassifyImage/ClassifyImage';
import { aperture } from 'ionicons/icons';
import { ClassificationStatus } from '../helpers/Statuses'
import './Home.css';

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
  IonList,
  IonListHeader,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/react'
import { Plugins, CameraResultType, CameraSource, CameraDirection  } from '@capacitor/core';
import { SelectChangeEventDetail } from '@ionic/core';
const { Camera, Storage } = Plugins;
const ml5 = require('ml5');

export interface TransferLearningProps {}

interface ObjectOption {
  id: number;
  label: string;
}

class Store {
    
  // JSON "set" example
  async setObject(key: string, value: object) {
    await Storage.set({
      key: key,
      value: JSON.stringify(value)
    });
  }

  // JSON "get" example
  async getObject(key: string) {
    const ret = await Storage.get({ key: key });
    return (ret.value==null?null:JSON.parse(ret.value));
  }

  async setItem(key: string, value: string) {
    await Storage.set({
      key: key,
      value: value
    });
  }

  async getItem(key: string) {
    return await Storage.get({ key: key });
  }

  async removeItem(key: string) {
    await Storage.remove({ key: 'name' });
  }

  async keys() {
    return await Storage.keys();
  }

  async clear() {
    await Storage.clear();
  }
}

export interface TransferLearningState {
  imageUrl: any,
  labelOptions: Array<ObjectOption>,
  selectedLabel: number
}

let store = new Store();

export default class TransferLearningPage extends Component<TransferLearningProps, TransferLearningState>  {

  labelInput: any;
  LABELS: string;

  constructor (props:{}) {
    super(props)
    this.state = {
      imageUrl: "",
      labelOptions: [
      ],
      selectedLabel: 0
    }
    this.LABELS = "labels"
    this.labelInput = React.createRef();
    store.setObject(this.LABELS, []);
  }
  
  compareWith = (o1: any, o2: any) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };
  
  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 75,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      direction: CameraDirection.Front 
    });
    this.setState({
      imageUrl: image.webPath
    })
  }

  async addLabel() {
    if (!this.labelInput) return;
    let newLabel = this.labelInput.current.value;
    if (newLabel === "") return;
    let labels = await store.getObject(this.LABELS) as Array<string>;
    if (!labels) labels = [];
    if (!labels.find((element) => element === newLabel)) {
      labels.push(newLabel);
      store.setObject(this.LABELS, labels);  
      let newLabelOptions = this.state.labelOptions;
      newLabelOptions.push({id: labels.length, label: newLabel})
      this.setState({
        labelOptions: newLabelOptions,
        selectedLabel: labels.length
      })
    }
  };

  onLabelSelected = (event: CustomEvent<SelectChangeEventDetail>) => {
    const target = event.target as HTMLInputElement;
    var newLabel: number = Number(target.value);
    if (newLabel) {
      var oldLabel = this.state.selectedLabel;
      this.setState({
        selectedLabel: newLabel
      })
      var testLabel = this.state.selectedLabel;
      console.log(" newLabel:"+newLabel+" oldLabel:"+oldLabel+" testLabel: "+testLabel);
    }
  }

  render () { 
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
            <IonCardHeader>
              <IonCardSubtitle>Trying camera now</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent> 
                <IonButton size="small" onClick={() => this.takePicture()}>
                  <IonIcon icon={aperture} />
                </IonButton>
                 <img src={this.state.imageUrl} id="image" width="75%" height="75%" alt="" />
            </IonCardContent>
          </IonCard>
          <form action="">
            <IonInput  ref={this.labelInput} type="text" maxlength={25} placeholder="Enter new label">
              <IonButton size="small" onClick={() => this.addLabel()}>Add</IonButton>
            </IonInput>
                
            <IonList>
              <IonItem>
                <IonLabel>Or select label</IonLabel>
                <IonSelect value={this.state.selectedLabel} 
                           compareWith={this.compareWith}
                           onIonChange={(e) => this.onLabelSelected(e)}
                           >
                  {this.state.labelOptions.map((object, i) => {
                    return (
                      <IonSelectOption key={object.id} value={object.id}>
                        {object.label}
                      </IonSelectOption>
                    );
                  })}>
                </IonSelect>
              </IonItem>
            </IonList>
          </form>
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
