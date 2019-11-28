
import React, { Component } from 'react'
import {
  IonCard,
  IonButton,
  IonCardTitle,
  IonCardHeader,
  IonContent,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput
} from '@ionic/react'
import { disc } from 'ionicons/icons';
import { TLModel, TLLabelOption, TLModelState } from '../Models/TLModel';
import FolderSelector from './FolderSelector';
import { FilesystemDirectory } from '@capacitor/core';


export interface ModelSettingsProps {
  model:TLModel,
  modelUpdated: any
}

export interface ModelSettingsState {
}


export default class ModelSettings extends Component<ModelSettingsProps, ModelSettingsState> {

  constructor (props:{model:TLModel, modelUpdated: any}) {
    super(props);
  }

  saveModel() {
    this.props.model.saveModel().then(()=>{
      this.setState({toastMsg: "Model saved", showToast: true});
    });
  }

  render() {
    let basePathStr = "";
    switch (this.props.model.modelOptions.basePath) {
      case FilesystemDirectory.Application: basePathStr = "Application"; break;
      case FilesystemDirectory.Cache: basePathStr = "Cache"; break;
      case FilesystemDirectory.Data: basePathStr = "Data"; break;
      case FilesystemDirectory.External: basePathStr = "External"; break;
      case FilesystemDirectory.ExternalStorage: basePathStr = "ExternalStorage"; break;
      default: basePathStr = "Documents"; break;
    }
    let modelDate = this.props.model.modelOptions.timeStamp?this.props.model.modelOptions.timeStamp.toDateString():"unknown";
    return <IonContent>
        <IonCard className="welcome-card">
            <IonCardContent> 
              <IonCardTitle>{this.props.model.modelOptions.name}</IonCardTitle>
              <IonItem>
                <IonLabel position="stacked">Create Date:</IonLabel>
                <IonInput type="date" value="Disabled">{modelDate}</IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Base Path:</IonLabel>
                <IonInput type="text" value="Disabled">{basePathStr}</IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Model:</IonLabel>
                <IonInput type="text" value="Disabled">{this.props.model.modelOptions.model}</IonInput>
              </IonItem>
            </IonCardContent> 
            <IonButton size="small" onClick={() => this.saveModel()}>Save Model</IonButton>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Model Options:</IonCardTitle>
              <IonItem>
                <IonLabel position="stacked">Epochs</IonLabel>
                <IonInput type="number">{this.props.model.modelOptions.options.epochs}</IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked"># Labels</IonLabel>
                <IonInput type="number">{this.props.model.modelOptions.options.numLabels}</IonInput>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Top K</IonLabel>
                <IonInput type="number">{this.props.model.modelOptions.options.topk}</IonInput>
              </IonItem>
          </IonCardHeader>
          <p></p>
        </IonCard>
      </IonContent>
  }
};
