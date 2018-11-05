import React from 'react'
import { Card } from 'antd';
import LogHeader from '../../components/Application/Log/LogHeader'
import LogTable from '../../components/Application/Log/LogTable'

export default class AppLog extends React.PureComponent {

  render(){
    const params = this.props.match.params;
    return (
      <div>
        <Card bordered={false} style={{margin:24}} title='应用日志'>
          <LogHeader appid={params.id} />
        </Card>

        <Card bordered={false} style={{margin:24}} title='应用操作记录'>
          <LogTable id={params.id} type='app'/> 
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