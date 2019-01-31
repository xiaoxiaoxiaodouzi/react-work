import React, { Component } from 'react'
import { base } from '../../services/base';
import constants from '../../services/constants';

export default class K8s extends Component {
  render() {
    
    return (
      <div style={{margin:'-24px -24px 0'}}>
        <iframe title='k8s监控' style={{border:0,height:3190,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.k8s}></iframe>
      </div>
       
    )
  }
}
