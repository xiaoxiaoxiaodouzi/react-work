import React, { PureComponent } from 'react';
import ApplicationTopo from '../Topo/ApplicationTopo'

export default class CallLink extends PureComponent {
  state = {
    traceId:undefined
  }
  componentDidMount(){
    if(this.props.traceId&&this.props.traceId.length>0){
      this.setState({traceId:this.props.traceId[0]})
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.traceId.length>0){
      this.setState({traceId:nextProps.traceId[0]});
    }
  } 
  render() {
    return (
      <ApplicationTopo traceId={this.state.traceId}/>
    );
  }
}
