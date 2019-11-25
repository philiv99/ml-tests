
import React, { Component } from 'react'
import {
  IonCard,
  IonButton,
  IonInput
} from '@ionic/react'
import { disc } from 'ionicons/icons';
import { TLModel, TLLabelOption } from '../Models/TLModel'


export interface ModelManagerProps {model:TLModel}

export default class ModelManager extends Component<ModelManagerProps> {

  modelNameRef: any;

  constructor (props:{model:TLModel}) {
    super(props);
    this.state = {
      predictions: [],
      classifying: false
    };
    this.modelNameRef =  React.createRef();
    this.updateModelName = this.updateModelName.bind(this);
  }

  updateModelName(event: React.FormEvent<HTMLIonInputElement>) {
    if (event.currentTarget && event.currentTarget.value && event.currentTarget.value != "")
      this.props.model.setModelName(event.currentTarget.value);
  }

  saveModel() {
    if (!this.modelNameRef) { return `No model name provided`; }
    let modelName = this.modelNameRef.current.value;
    if (modelName == "") { return `No model name provided`; }
    return this.props.model.saveModel(modelName);
  }

  render() {
    return <IonCard className="welcome-card">
        <IonInput ref={this.modelNameRef} type="text" onChange={this.updateModelName} maxlength={25} placeholder="Enter model name">
          <IonButton size="small" onClick={() => this.saveModel()}>Update</IonButton>
        </IonInput>
      </IonCard>
  }
};
