import React from 'react'
import { Card } from 'antd';
import LogHeader from '../../components/Application/Log/LogHeader'
import LogTable from '../../components/Application/Log/LogTable'
import EventsTable from '../../components/Application/Log/EventsTable'
import { ErrorComponentCatch } from '../../common/SimpleComponents';
import { base } from '../../services/base';

class AppLog extends React.PureComponent {

  render(){
    const params = this.props.match.params;
    return (
      <div>
        {this.props.deployMode === 'k8s' && this.props.appCode && base.configs.passEnabled?<Card bordered={false} style={{margin:24}} title='运行日志'>
          <LogHeader appid={params.id} />
        </Card>:''}
        <Card bordered={false} style={{margin:24}} title='变更日志'>
          <LogTable id={params.id} type='web' readyable={true}/> 
        </Card>
        {this.props.deployMode === 'k8s' && this.props.appCode && base.configs.passEnabled?
        <Card bordered={false} style={{margin:24}} title='事件'>
            <EventsTable appCode={this.props.appCode} />
        </Card>
        :""}

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

export default ErrorComponentCatch(AppLog);