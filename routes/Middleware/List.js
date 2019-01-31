import React from 'react'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import {AppTable,AppState} from '../../components/Application/AppList'
import {queryAppCount} from '../../services/aip';
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'

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
      queryAppCount({tenant:nextProps.tenant,status:'succeeded',type:'middleware'}).then(data=>{
        this.setState({succeededCount:data});
      })
      queryAppCount({tenant:nextProps.tenant,status:'exception',type:'middleware'}).then(data=>{
        this.setState({exceptionCount:data});
      })
      queryAppCount({tenant:nextProps.tenant,status:'failed',type:'middleware'}).then(data=>{
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
        <PageHeaderBreadcrumb breadcrumbList={[{name:'中间件管理'}]} action={<GlobalEnvironmentChange/>}/>
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