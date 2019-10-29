
import React, { Component } from 'react'
import './ClassifyImage.css'
import { PredictorStatus } from '../../helpers/Statuses'
import IosSettings from 'react-ionicons/lib/IosSettings'
import IosCloseCircle from 'react-ionicons/lib/IosCloseCircle'
import MdUnlock from 'react-ionicons/lib/MdUnlock'
import MdLock from 'react-ionicons/lib/MdLock'



class ClassifyImage extends Component {

  constructor (props) {
    super(props);
    this.state = {
      predictions: [],
      classifying: false
    };
    this.predictorState = PredictorStatus.new
    this.imageRef = React.createRef();
  }

  classifierReady = () => {
    return this.predictorState === PredictorStatus.ready && this.props.imageUrl;
  }
  
  dataReady = () => {
    return this.predictorState === PredictorStatus.ready && this.state.predictions.length > 0;
  }

  componentDidUpdate = () => {
    this.predictorState = PredictorStatus.ready;
  }

  classifyImg = () => {
    this.predictorState = PredictorStatus.classifying;
    this.setState({classifying: true});
    try {
      this.props.classifier.predict(this.imageRef.current, 7, (err, results) => {
        if (err) {
          alert ("Error: "+err)
          this.predictorState = PredictorStatus.error;
        } 
        return results;
      }).then((results) => {
        this.predictorState = PredictorStatus.ready;
        this.setState({predictions: results});
      })
    } catch(err) {
      alert ("Error: "+err)
      this.predictorState = PredictorStatus.error;
    }
  }

  render() {
    let predictions = (<div className="loader">No prediction yet</div>);
    if (this.dataReady()) {
      let gotGoodPrediction = false;
      let tempPredictions = this.state.predictions.map((pred, i) => {
        let { label, confidence } = pred;
        const probability = Math.floor(confidence * 10000) / 100 ;
        if (probability > 40 || i == 0) {
          gotGoodPrediction = true;
          return (<div key={ i + "" }> { label } ({ probability + "%" }) </div>)
        } else 
          return null;
      })
      if (gotGoodPrediction)
        predictions = tempPredictions;
      else
        predictions = (<div className="loader">No predictions</div>);
    } 
    
    let icon = <MdUnlock  />
    switch(this.predictorState) {
      case PredictorStatus.new:
        icon = <MdLock />
        break
      case PredictorStatus.ready:
        icon = <MdUnlock  />
        break
      case PredictorStatus.classifying:
        icon = <IosSettings rotate={true}/>
        break
      case PredictorStatus.error:
        icon = <IosCloseCircle color="red" />
        break
      default:
        icon = <MdUnlock  />
        break

    }
    return (
      <div className="App ion-text-center">
        {icon}
        <br/>
        <img  ref={this.imageRef} src={this.props.imageUrl} onLoad={this.classifyImg} id="image" width="75%" alt="" />
        <br/>
        { predictions }
      </div>
    );
  }
}

export default ClassifyImage;