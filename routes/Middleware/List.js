import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import {Breadcrumb,Divider} from 'antd';
import {AppTable,AppState} from '../../components/Application/AppList'
import {queryAppCount} from '../../services/apps';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'


//面包屑
// const breadcrumbList = [{
//   title: '首页',
//   href: '#/',
// }, {
//   title: '中间件列表'
// }];
const breadcrumbList = <Breadcrumb style={{marginTop:6}}>
<Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 中间件列表</Breadcrumb.Item>
</Breadcrumb>;


class AppList extends React.Component {
  state ={
    status:null,
    succeededCount:0,
    exceptionCount:0,
    failedCount:0,
  }
  componentDidMount(){
    queryAppCount({tenant:this.props.tenant,status:'succeeded',type:'middleware'}).then(data=>{
      this.setState({succeededCount:data});
    })
    queryAppCount({tenant:this.props.tenant,status:'exception',type:'middleware'}).then(data=>{
      this.setState({exceptionCount:data});
    })
    queryAppCount({tenant:this.props.tenant,status:'failed',type:'middleware'}).then(data=>{
      this.setState({failedCount:data});
    })
  }
  componentWillUpdate(nextProps){
    if(this.props.tenant!== nextProps.tenant || this.props.environment !== nextProps.environment){
      queryAppCount({tenant:nextProps.tenant,status:'succeeded'}).then(data=>{
        this.setState({succeededCount:data});
      })
      queryAppCount({tenant:nextProps.tenant,status:'exception'}).then(data=>{
        this.setState({exceptionCount:data});
      })
      queryAppCount({tenant:nextProps.tenant,status:'failed'}).then(data=>{
        this.setState({failedCount:data});
      })
    }
  }
  onStatusChange = (status)=>{
    this.setState({ status });
  }
  render() {
    const { status,succeededCount,exceptionCount,failedCount } = this.state;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader title={breadcrumbList}
         action={<GlobalEnvironmentChange/>}/>
        <AppState normal={succeededCount} warm={exceptionCount} abnormal={failedCount} onStatusChange={this.onStatusChange} />
        <AppTable status={status} onStatusChange={this.onStatusChange} tenant={this.props.tenant} environment={this.props.environment} type="middleware" />
      </div>
    );
  }
}

export default props=>(
  <GlobalHeaderContext.Consumer>
    {context=><AppList {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);