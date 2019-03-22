import React from 'react'
import { Card } from 'antd';
import LogHeader from '../../components/Application/Log/LogHeader'
import LogTable from '../../components/Application/Log/LogTable'
import EventsTable from '../../components/Application/Log/EventsTable'
import { ErrorComponentCatch } from '../../common/SimpleComponents';
import { base } from '../../services/base';

class AppLog extends React.PureComponent {

  render() {
    const appData = this.props.appData;
    let deployMode = this.props.appData ? this.props.appData.deployMode : this.props.deployMode;
    let appCode = this.props.appData ? this.props.appData.code : this.props.appCode;
    return (
      <div>
        {deployMode === 'k8s' && appCode && base.configs.passEnabled ? <Card bordered={false} style={{ margin: 24 }} title='运行日志'>
          <LogHeader appData={this.props.appData} />
        </Card> : ''}
        <Card bordered={false} style={{ margin: 24 }} title='变更日志'>
          <LogTable id={appData.id} type='web' readyable={true} />
        </Card>
        {deployMode === 'k8s' && appCode && base.configs.passEnabled ?
          <Card bordered={false} style={{ margin: 24 }} title='事件'>
            <EventsTable appCode={appCode} />
          </Card>
          : ""}

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