import React from 'react'
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb'
import { AppTable, AppState } from '../../components/Application/AppList'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange'
// import { queryAppCount } from '../../services/aip';
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import {getAppStatus} from'../../services/monit';
import { base } from '../../services/base';

class AppList extends React.Component {
  state = {
    status: null,
    succeededCount: 0,
    unknownCount: 0,
    failedCount: 0,
    loading: false,
    appStateMap:{},
    allStatus:{}
  }
  componentDidMount() {
    this.loadData(this.props.tenant);
  }

  loadData = (tenant) => {
    this.setState({ loading: true })
    if(base.configs.monitEnabled){
      getAppStatus({'env':base.currentEnvironment.code,'tenant':base.tenant}).then(res=>{
        if(res){
          //将返回结果转换为appcode：status形式
          let appStateMap = {};
          for(var key in res){
            let object = res[key];
            let codes = object.code;
            // eslint-disable-next-line
            codes.forEach(code => {
              appStateMap[code] = key;
            });         
          }
          this.setState({
            succeededCount: res.Running.num ,
            unknownCount: res.Unknown.num,
            failedCount: res.Failed.num,
            loading: false,
            allStatus:res,
            appStateMap
          })
        }
        
      }).catch(e => {
        this.setState({
          succeededCount: 0,
          exceptionCount: 0,
          failedCount: 0,
          loading: false
        });
        base.ampMessage('根据状态统计应用错误' );
      })
    }
    
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.tenant !== nextProps.tenant || this.props.environment !== nextProps.environment) {
      this.loadData(nextProps.tenant);
    }
  }
  onStatusChange = (status) => {
    this.setState({ status });
  }
  render() {
    const { status, succeededCount, unknownCount, failedCount ,loading} = this.state;
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'应用管理'}]} action={<GlobalEnvironmentChange/>}/>
       {base.configs.monitEnabled? <AppState normal={succeededCount} unknown={unknownCount} abnormal={failedCount} onStatusChange={this.onStatusChange} loading={loading}/>:""}
        <AppTable allStatus={this.state.allStatus} appStateMap={this.state.appStateMap} loading={loading} status={status} onStatusChange={this.onStatusChange} tenant={this.props.tenant} environment={this.props.environment} />
      </div>
    );
  }
}

export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <AppList {...props} tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);
