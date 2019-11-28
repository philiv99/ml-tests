
import React, { Component } from 'react'
import {
  IonCard,
  IonButton,
  IonInput,
  IonToast,
  IonContent,
  IonCardContent,
  IonCardHeader
} from '@ionic/react'
import { disc } from 'ionicons/icons';
import { TLModel, TLLabelOption, TLModelState } from '../Models/TLModel';
import FolderSelector from './FolderSelector';
import ModelSettings from './ModelSettings';


export interface ModelManagerProps {
  model:TLModel
}

export interface ModelManagerState {
  newModel: TLModel,
  loadedModel: TLModel,
  showToast: boolean,
  toastMsg: string,
  managerState: number
}


export default class ModelManager extends Component<ModelManagerProps, ModelManagerState> {

  modelNameRef: any;
  selectedModelName: string;

  constructor (props:{model:TLModel}) {
    super(props);
    this.state = {
      newModel: new TLModel(),
      loadedModel: this.props.model,
      showToast: false,
      toastMsg: "",
      managerState: 0
    };
    this.selectedModelName = "";
    this.modelNameRef =  React.createRef();
    this.updateModelName = this.updateModelName.bind(this);
    this.setSelectedModelFolder = this.setSelectedModelFolder.bind(this);
  }

  updateModelName(event: React.FormEvent<HTMLIonInputElement>) {
    if (event.currentTarget && event.currentTarget.value && event.currentTarget.value != "")
      this.props.model.setModelName(event.currentTarget.value);
  }

  saveModel() {
    let modelName = "";
    if (this.modelNameRef && !this.modelNameRef.current) { 
      modelName = this.modelNameRef.current.value;
    }
    this.props.model.saveModel(modelName).then(()=>{
      this.setState({toastMsg: "Model saved", showToast: true});
    });
  }

  setShowToast(show: boolean) {
    this.setState({showToast: show});
  }

  setSelectedModelFolder(path: string) {
    this.selectedModelName = path;
    alert(`selected path: ${this.selectedModelName}`)
  }

  modelOptionsUpdated() {
    alert("Updating model");
  }

  async loadModel () {
    alert(`loading model: ${this.selectedModelName}`)
    await this.state.loadedModel.loadModel(this.selectedModelName)
      .then((m)=> {
          alert("model loaded");
        }, 
        (err) => { alert(`loadModel error: ${err}`)}
      );
      
    this.setState({managerState: 1})
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
        <IonCard className="welcome-card">
            <IonCardHeader>Select model to load:</IonCardHeader>
          <IonCardContent>
          <FolderSelector rootPath="models" selectPath={this.setSelectedModelFolder} />
          <IonButton size="small" onClick={() => this.loadModel()}>Load Model</IonButton>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardContent> 
            {this.state.loadedModel.name}
            {/* <ModelSettings model={this.state.loadedModel} modelUpdated={this.modelOptionsUpdated} /> */}
          </IonCardContent> 
        </IonCard>
        <IonToast
          isOpen={this.state.showToast}
          onDidDismiss={() => this.setShowToast(false)}
          message={this.state.toastMsg}
          duration={2000}
        />
      </IonContent>
  }
};
