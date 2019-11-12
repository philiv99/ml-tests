/// <reference path="../types/ml5.d.ts" />
import { BaseModel } from './Model';
const ml5 = require('ml5');

export interface Prediction {
  label: string;
  confidence: number;
  count: number;
}

export class TLTrainingDatum {
    fileUri: string;
    label: string | number;

    constructor () {
        this.fileUri = "";
        this.label = "";
    }
}

export interface TLLabelOption {
    label: string;
  }

export class TLModel extends BaseModel {
    trainingData: Array<TLTrainingDatum>;
    labels: Array<TLLabelOption>;
    featureExtractor: any;
    classifier: any;

    constructor () {
        super();
        this.trainingData = new Array<TLTrainingDatum>();
        this.labels = new Array<TLLabelOption>();
    }

    version () {
        return `ml5 version: ${ml5.version}`;
    }

    async createModel () {
        this.featureExtractor = await ml5.featureExtractor("MobileNet", {
            version: 1,
            alpha: 1.0,
            topk: 3,
            learningRate: 0.0001,
            hiddenUnits: 100,
            epochs: 30,
            numLabels: 20,
            batchSize: 0.4,
          });
        return this.classifier = this.featureExtractor.classification();
    }
    
    predict(image: any) {
        return this.classifier.classify(image); 
    }
  

    loadModel (name: string) {

    }

    addLabel(label: string) {
        if (!this.labels.find((l) => { return l.label == label  })) 
            return this.labels.push({ label: label});
        else
            return 0;
    }

    train(cb ?: any) {
        return this.classifier.train((loss:any)=>{if (typeof cb == 'function') cb(loss)});
    }

    addTrainingExample(image: any, label: string) {
      return this.classifier.addImage(image, label);
    }
    
    saveModel () {

    }
}