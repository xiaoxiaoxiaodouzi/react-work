import React from 'react'
import {base} from '../services/base';
import constants from '../services/constants';
import { Card } from 'antd';

class OverView extends React.Component{
  state={
    appCode:this.props.appCode
  }
  render() {
    const url = base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.app+`&var-pod=${this.state.appCode}`;
    
    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <iframe title='grafana' src={url} frameBorder="0" style={{ width: '100%',height:'2270px' }}></iframe>
      </Card>
    );
  }
}
export default OverView;

