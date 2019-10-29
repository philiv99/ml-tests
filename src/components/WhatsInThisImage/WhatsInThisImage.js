
import ml5 from 'ml5';
import React, { Component } from 'react'

class WhatsInThisImage extends Component {
    imageRef = React.createRef();
    async predict() {
      if (!this.imageRef.current) return;
      this.setState(s => ({ ...s, isLoading: true}));
      try {
        const classifier = await ml5.imageClassifier("MobileNet");
        const results = await classifier.predict(this.imageRef.current);
        if (results.length === 0) {
          this.setState({error: new Error("NO_PREDICTIONS"), isLoading: false})
          return;
        } else {
          this.setState({
            isLoading: false,
            prediction: {
              className: results[0].className,
              probability: results[0].probability
            }
          });
        }
      } catch(error) {
        this.setState({ error, isLoading: false});
        return;
      }
    }
  
    render() {
      return <>
        {this.props.renderImg}
        <br/>
        Classification: {this.state.prediction.className}
        <br/>
        probability: {this.state.prediction.probability}
      </>;
    }
  }
  
  
//   <WhatsInThisImage 
//   renderImage={
//     this.state.file 
//     ? ({ref}) => <img src={this.state.file} ref={ref} />
//     : null
//   }
// />