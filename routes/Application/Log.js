import React from 'react'
import { Card } from 'antd';
import LogHeader from '../../components/Application/Log/LogHeader'
import { getAppInfo } from '../../services/appdetail';


export default class AppLog extends React.PureComponent {

  render(){
    const params = this.props.match.params;
    return (
      <div>
        <Card bordered={false} style={{margin:24}}>
          <LogHeader appid={params.id} />
        </Card>

        {/* <Card bordered={false} style={{margin:24}}>
          UrlId:{params.id} 日志
        </Card>

        <Card bordered={false} style={{margin:24}}>
          UrlId:{params.id} 日志
        </Card> */}
      </div>
      
    )
  }
}