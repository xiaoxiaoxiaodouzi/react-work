import React from 'react'
import {CertificationOpen} from '../../components/Application/Running'
export default class AppRunning extends React.PureComponent {
  
  render(){
    return (
      <div>
          {/* <Entrance appid={this.props.match.params.id} /> */}
          <CertificationOpen appid={this.props.match.params.id}/>:
      </div>
      
    )
  }
}