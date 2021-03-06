/// <reference path="../types/ml5.d.ts" />
import { FilesystemDirectory } from '@capacitor/core';
import { BaseModel } from './Model';
import FileManager from '../services/FileManager'
const ml5 = require('ml5');


export enum TLModelState {
    new = 'new',
    loaded = 'loaded',
    trained = 'trained'
  }

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
        labels: Array<TLLabelOption>;
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
            labels: new Array<TLLabelOption>(),
            epochs: 30,
            numLabels: 30,
            topk: 3
        }
    }
}

export class TLModel extends BaseModel {
    trainingData: Array<TLTrainingDatum>;
    featureExtractor: any;
    classifier: any;
    modelState: TLModelState;
    fileMgr: FileManager;
    
    public modelOptions: ModelOptions;

    constructor () {
        super();
        this.trainingData = new Array<TLTrainingDatum>();
        this.modelState = TLModelState.new;
        this.modelOptions = new ModelOptions();
        this.fileMgr = new FileManager();
    }

    setModelName (name: string) {
        this.modelOptions.name = name.replace(/[ |&;$%@"<>()+,]/g, "");
    }

    setOptions (options:ModelOptions) {
        this.modelOptions = options;
    }


    version () {
        return `ml5 version: ${ml5.version}`;
    }

    async createModel () {
        this.featureExtractor = await ml5.featureExtractor(this.modelOptions.model, this.modelOptions.options);
        return this.classifier = this.featureExtractor.classification(null, () => {this.modelState = TLModelState.loaded});
    }
    
    predict(image: any) {
        return this.classifier.classify(image); 
    }

    addLabel(label: string) {
        if (!this.modelOptions.options.labels.find((l) => { return l.label == label  })) 
            return this.modelOptions.options.labels.push({ label: label});
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

    async loadModel (name: string) {
        alert("loadModel()")
        return this.fileMgr.fileRead(`models/${name}/ModelOptions.json`, FilesystemDirectory.Documents)
            .then((options) => {
                if (options && options.data)
                    this.modelOptions = JSON.parse(options.data);
                    alert(`${this.modelOptions.name} modelOptions loaded`)
                    this.fileMgr.fileRead(`models/${name}/TrainingData.json`, FilesystemDirectory.Documents)
                        .then((history) => {
                            this.trainingData = JSON.parse(history.data);
                            alert(`loaded ${this.trainingData.length} training examples`)
                        });
            });
    }
    
    async saveModel (modelName: string = "") {
        let name = modelName == ""?this.name:modelName;
        let modelOptionsJson = JSON.stringify(this.modelOptions);
        return this.fileMgr.fileWrite(`models/${name}/ModelOptions.json`, modelOptionsJson)
                .then((r) => {
                    let trainingDataJson = JSON.stringify(this.getTrainingHistory());
                    return this.fileMgr.fileWrite(`models/${name}/TrainingData.json`, trainingDataJson);
                });
            // alert(`Saving model`);
            // this.classifier.save((weightsManifest:string, weightData:any)=>{
            //     // if (!weightData)
            //     //     alert("Weight data undefined")
            //     // else
            //     //     alert(`typeof weightData: ${typeof weightData}`)
            //     // alert ("weightsManifest: "+weightsManifest);
            //     // fileMgr.fileWrite(`models/${name}/WeightsManifest.json`, weightsManifest);
            //     //fileMgr.fileWrite(`models/${this.modelOptions.name}/${name}.weights.bin`)
            //     //fileMgr.fileWrite(`models/${this.modelOptions.name}/${name}.weights.bin`, weightData);
            // }, name);

            // fileMgr.readdir(`models/${this.modelOptions.name}`).then((r)=> alert (`models/${this.modelOptions.name}:  ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("com.infogoer.mltests", FilesystemDirectory.ExternalStorage).then((r)=> alert (`Data: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.Application).then((r)=> alert (`Application: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.Cache).then((r)=> alert (`Cache: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.Data).then((r)=> alert (`Data: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.Documents).then((r)=> alert (`Documents: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.External).then((r)=> alert (`External: ${JSON.stringify(r)}`));
            // fileMgr.readdirectory("", FilesystemDirectory.ExternalStorage).then((r)=> alert (`ExternalStorage:  ${JSON.stringify(r)}`));

    }
}