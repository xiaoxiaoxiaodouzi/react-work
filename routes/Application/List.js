import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {Breadcrumb,Divider} from 'antd';
import { AppTable, AppState } from '../../components/Application/AppList'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import { queryAppCount } from '../../services/apps';
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'

class AppList extends React.Component {
  state = {
    status: null,
    succeededCount: 0,
    exceptionCount: 0,
    failedCount: 0,
    loading: false,
  }
  componentDidMount() {
    this.loadData(this.props.tenant);
  }

  loadData = (tenant) => {
    this.setState({ loading: true })
    let querySuccess = queryAppCount({ tenant: tenant, status: 'succeeded',type:"web" });
    let queryException = queryAppCount({ tenant: tenant, status: 'exception',type:"web" });
    let queryFailed = queryAppCount({ tenant: tenant, status: 'failed' ,type:"web"})
    Promise.all([querySuccess, queryException, queryFailed]).then(res => {
      this.setState({
        succeededCount: res[0],
        exceptionCount: res[1],
        failedCount: res[2],
        loading: false
      })
    }).catch(err => {
      this.setState({
        succeededCount: 0,
        exceptionCount: 0,
        failedCount: 0,
      })
    })
  }




  componentWillUpdate(nextProps) {
    if (this.props.tenant !== nextProps.tenant || this.props.environment !== nextProps.environment) {
      this.loadData(nextProps.tenant);
    }
  }



  onStatusChange = (status) => {
    this.setState({ status });
  }
  render() {
    const { status, succeededCount, exceptionCount, failedCount ,loading} = this.state;
    let breadcrumTitle = <Breadcrumb style={{marginTop:6}}>
    <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 应用管理</Breadcrumb.Item>
  </Breadcrumb>;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={breadcrumTitle} action={<GlobalEnvironmentChange/>}/>
        <AppState normal={succeededCount} warm={exceptionCount} abnormal={failedCount} onStatusChange={this.onStatusChange} loading={loading}/>
        <AppTable loading={loading} status={status} onStatusChange={this.onStatusChange} tenant={this.props.tenant} environment={this.props.environment} />
      </div>
    );
  }
}


export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <AppList {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);
