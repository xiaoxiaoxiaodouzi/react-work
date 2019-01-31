import React, { PureComponent } from 'react';
import {base} from '../../../services/base';
import constants from '../../../services/constants';

export default class FunctionMonit extends PureComponent {
  render() {
    const fid = this.props.data.code;
    return (
      <div>
        <iframe title='功能监控' style={{border:0,height:760,width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.functionMonit+`&var-env=${base.currentEnvironment.code}&var-fid=${fid}`}></iframe>
      </div>
    )
  }
}
