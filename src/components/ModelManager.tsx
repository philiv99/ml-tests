
import React, { Component } from 'react'
import {
  IonCard,
  IonButton,
  IonInput,
  IonToast,
  IonContent,
  IonCardContent
} from '@ionic/react'
import { disc } from 'ionicons/icons';
import { TLModel, TLLabelOption, TLModelState } from '../Models/TLModel';
import FolderSelector from './FolderSelector';


export interface ModelManagerProps {
  model:TLModel
}

export interface ModelManagerState {
  newModel: TLModel,
  loadedModel: TLModel,
  showToast: boolean,
  toastMsg: string
}


export default class ModelManager extends Component<ModelManagerProps, ModelManagerState> {

  modelNameRef: any;

  constructor (props:{model:TLModel}) {
    super(props);
    this.state = {
      newModel: new TLModel(),
      loadedModel: this.props.model,
      showToast: false,
      toastMsg: ""
    };
    this.modelNameRef =  React.createRef();
    this.updateModelName = this.updateModelName.bind(this);
  }

  updateModelName(event: React.FormEvent<HTMLIonInputElement>) {
    if (event.currentTarget && event.currentTarget.value && event.currentTarget.value != "")
      this.props.model.setModelName(event.currentTarget.value);
  }

  saveModel() {
    if (!this.modelNameRef || !this.modelNameRef.current) { return `No model name provided`; }
    let modelName = this.modelNameRef.current.value;
    if (modelName == "") { return `No model name provided`; }
    this.props.model.saveModel(modelName).then(()=>{
      this.setState({toastMsg: "Model saved", showToast: true});
    });
  }

  setShowToast(show: boolean) {
    this.setState({showToast: show});
  }

  setSelectedModelFolder(path: string) {
    alert(`New Mode: ${path}`);
  }

  loadModel () {

  }

  render() {
    return <IonContent>
        <IonCard className="welcome-card">
            <IonCardContent> 
                <span>{this.props.model.modelOptions.name}</span>
            </IonCardContent> 
          <IonInput ref={this.modelNameRef} type="text" onChange={this.updateModelName} maxlength={25} placeholder="Enter model name">
            <IonButton size="small" onClick={() => this.saveModel()}>Save Model</IonButton>
          </IonInput>
        </IonCard>
        <FolderSelector rootPath="models" selectPath={this.setSelectedModelFolder} />
        <IonButton size="small" onClick={() => this.loadModel()}>Load Model</IonButton>
        <IonToast
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setShowToast(false)}
          message={this.state.toastMsg}
          duration={20000}
        />
      </IonContent>
  }
};
