
export interface ModelI {
    name: string;
    fileUri: string;
}

export class BaseModel implements ModelI {
    name: string;
    fileUri: string;

    constructor (n: string = "", f: string = "") {
        this.name = n;
        this.fileUri = f;
    }
}

export class TLTrainingDatum {
    fileUri: string;
    label: string | number;

    constructor () {
        this.fileUri = "";
        this.label = "";
    }
}

export class TLModel extends BaseModel {
    trainingData: Array<TLTrainingDatum>;

    constructor () {
        super();
        this.trainingData = new Array<TLTrainingDatum>();
    }
}