import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {AppTable,AppState} from '../../components/Application/AppList'
import {queryAppCount} from '../../services/apps';

//面包屑
const breadcrumbList = [{
  title: '首页',
  href: '#/',
},{
  title: '应用列表'
}];

class AppList extends React.Component {
  state ={
    status:null,
    succeededCount:0,
    exceptionCount:0,
    failedCount:0,
  }
  componentDidMount(){
    queryAppCount({tenant:this.props.tenant,status:'succeeded'}).then(data=>{
      this.setState({succeededCount:data});
    })
    queryAppCount({tenant:this.props.tenant,status:'exception'}).then(data=>{
      this.setState({exceptionCount:data});
    })
    queryAppCount({tenant:this.props.tenant,status:'failed'}).then(data=>{
      this.setState({failedCount:data});
    })
  }
  onStatusChange = (status)=>{
    this.setState({ status });
  }
  render() {
    const { status,succeededCount,exceptionCount,failedCount } = this.state;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title="应用列表" breadcrumbList={breadcrumbList} />
        <AppState normal={succeededCount} warm={exceptionCount} abnormal={failedCount} onStatusChange={this.onStatusChange} />
        <AppTable status={status} tenant={this.props.tenant} environment={this.props.environment}/>
      </div>
    );
  }
}

export default AppList;