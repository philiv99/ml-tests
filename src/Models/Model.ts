
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
