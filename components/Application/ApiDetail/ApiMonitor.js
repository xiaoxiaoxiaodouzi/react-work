import React, { PureComponent } from 'react'
import {base} from '../../../services/base';
import constants from '../../../services/constants'

export default class ApiMonitor extends PureComponent {
  render() {
    const {apiMethod,apiPath} = this.props;
    return (
      <div>
        <iframe title='Grafana' style={{border:0,height:1040,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.apiMonit+`&var-env=${base.currentEnvironment.code}&var-path=${apiPath}&var-method=${apiMethod}&var-id=${this.props.code}`}></iframe>
      </div>
    )
  }
}
