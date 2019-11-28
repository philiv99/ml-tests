
import React, { Component } from 'react'
import {
  IonItem,
} from '@ionic/react'
//import { disc } from 'ionicons/icons';
import FileManager from '../services/FileManager'
import { FilesystemDirectory } from '@capacitor/core';


export interface FolderSelectorProps {
    rootPath: string,
    selectPath: any
}

export interface FolderSelectorState {
    rootPath:string,
    paths: Array<string>,
    selectedPath: string
}

export default class FolderSelector extends Component<FolderSelectorProps, FolderSelectorState> {

    constructor (props: { rootPath: string, selectPath: any}) {
        super(props);
        this.state = {
            rootPath: this.props.rootPath,
            paths: [],
            selectedPath: ""
        };
    }

    componentDidMount () {
        this.initPaths();
    }

    initPaths() {
        const fileMgr = new FileManager();
        fileMgr.readdirectory(this.state.rootPath, FilesystemDirectory.Documents).then((r)=> 
        {
            this.setState({paths: r.files})
            if (r.files.length() > 0)
                this.props.selectPath(r.files[0])
        });
    }
    
    onPathSelected = (selectedObject: React.ChangeEvent<HTMLSelectElement>) => {
        var newPath = selectedObject.currentTarget.value;
        if (newPath) {
            this.setState({selectedPath: newPath})
            this.initPaths();
        }
        this.props.selectPath(newPath);
    }

    getPathOptions() {
        if (this.state.paths)
            return <select  value={this.state.selectedPath} onChange={(e) => this.onPathSelected(e)}>
                    {this.state.paths.map((path, i) => {
                        return (
                            <option key={`path${i}`} value={path}>
                                {path}
                            </option>
                        );
                    })}>
                </select>;
        else 
            return <p>No models</p>
    }

    render () {
        let options = this.getPathOptions();
        return <>
            <IonItem>
                {options}
            </IonItem>
        </>
    }
}