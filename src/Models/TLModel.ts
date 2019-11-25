/// <reference path="../types/ml5.d.ts" />
import { FilesystemDirectory } from '@capacitor/core';
import { BaseModel } from './Model';
import FileManager from '../services/FileManager'
const ml5 = require('ml5');

export interface Prediction {
  label: string;
  confidence: number;
  count: number;
}

export class TLTrainingDatum {
    fileUri: string;
    label: string | number;

    constructor (fileUri: string = "", label: string = "") {
        this.fileUri = fileUri;
        this.label = label;
    }
}

export interface TLLabelOption {
    label: string;
}

export class ModelOptions {
    name: string;
    timeStamp: Date;
    basePath: string;
    model: string;
    options: {
        epochs: number;
        numLabels: number;
        topk: number;
    }

    constructor () {
        this.name = "Test";
        this.timeStamp = new Date();
        this.basePath = FilesystemDirectory.Documents;
        this.model = "MobileNet";
        this.options = {
            epochs: 30,
            numLabels: 30,
            topk: 3
        }
    }
}

export class TLModel extends BaseModel {
    trainingData: Array<TLTrainingDatum>;
    labels: Array<TLLabelOption>;
    featureExtractor: any;
    classifier: any;
    
    modelOptions: ModelOptions;

    constructor () {
        super();
        this.trainingData = new Array<TLTrainingDatum>();
        this.labels = new Array<TLLabelOption>();

        this.modelOptions = new ModelOptions();
    }

    setModelName (name: string) {
        var cleanName = name.replace(/[ |&;$%@"<>()+,]/g, "");
        this.modelOptions.name = cleanName;
    }

    setOptions (options:ModelOptions) {
        this.modelOptions = options;
    }


    version () {
        return `ml5 version: ${ml5.version}`;
    }

    async createModel () {
        this.featureExtractor = await ml5.featureExtractor(this.modelOptions.model, this.modelOptions.options);
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
        var tlTrainingDatum = new TLTrainingDatum(image.src, label);
        this.trainingData.push(tlTrainingDatum);

        return this.classifier.addImage(image, label);
    }

    getTrainingHistory() {
        return this.trainingData;
    }
    
    saveModel (modelName: string) {
        const fileMgr = new FileManager();
        try {
            let modelOptionsJson = JSON.stringify(this.modelOptions);
            fileMgr.fileWrite(`models/${this.modelOptions.name}/${modelName}.opt`, modelOptionsJson);
            let trainingDataJson = JSON.stringify(this.getTrainingHistory());
            fileMgr.fileWrite(`models/${this.modelOptions.name}/${modelName}.trn`, trainingDataJson);
            alert(`Saving model`);
            this.classifier.save().then((x:any)=>{alert ("Save result: "+JSON.stringify(x));});

            fileMgr.readdir(`models/${this.modelOptions.name}`).then((r)=> alert (`models/${this.modelOptions.name}:  ${JSON.stringify(r)}`));
            fileMgr.readdirectory("com.infogoer.mltests", FilesystemDirectory.ExternalStorage).then((r)=> alert (`Data: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.Application).then((r)=> alert (`Application: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.Cache).then((r)=> alert (`Cache: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.Data).then((r)=> alert (`Data: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.Documents).then((r)=> alert (`Documents: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.External).then((r)=> alert (`External: ${JSON.stringify(r)}`));
            fileMgr.readdirectory("", FilesystemDirectory.ExternalStorage).then((r)=> alert (`ExternalStorage:  ${JSON.stringify(r)}`));

            return alert("Model saved");
        } catch (err) {
            alert(`Error saving model: ${err}`)
            return `Error saving model: ${err}`;
        }
    }
}