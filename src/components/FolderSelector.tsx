
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
        this.initPaths();
    }

    initPaths() {
        const fileMgr = new FileManager();
        fileMgr.readdirectory(this.state.rootPath, FilesystemDirectory.Documents).then((r)=> this.setState({paths: r.files}));
    }
    
    onPathSelected = (selectedObject: React.ChangeEvent<HTMLSelectElement>) => {
        var newPath = selectedObject.currentTarget.value;
        if (newPath) {
            this.setState({selectedPath: newPath})
            this.initPaths();
        }
        this.props.selectPath(newPath);
    }

    // getDirectory() {
    //    const fileMgr = new FileManager();
    //     fileMgr.readdirectory(this.state.rootPath, FilesystemDirectory.Documents).then((r)=> alert (`Documents: ${JSON.stringify(r)}`));
    //     this.setState({paths: ["file3","file4"]})
    // }

    render () {
        return <>
            <IonItem>
                <select  value={this.state.selectedPath} onChange={(e) => this.onPathSelected(e)}>
                    {this.state.paths.map((path, i) => {
                        return (
                            <option key={`path${i}`} value={path}>
                                {path}
                            </option>
                        );
                    })}>
                </select>
            </IonItem>
        </>
    }
}