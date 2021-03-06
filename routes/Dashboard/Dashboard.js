import React, { Fragment } from 'react';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Card,Tooltip,Spin } from 'antd';
//import GatewayDash from '../../components/Dashboard/GatewayDash';
import Clusters from '../../components/Dashboard/Clusters';
import TenantList from '../../components/Dashboard/TenantList';
import '../Application/Overview.less';
import {formateValue} from '../../utils/utils'
import constants from '../../services/constants';

class Dashboard extends React.Component {
  state={
    appCount:null,
    serviceCount:null,
    userCount:null,
    tenantCount:null,
    clusterCount:null,
    hostCount:null,
    cpus:null,
    cpuTotal:null,
    rams:null,
    ramsTotal:null,
    clusterLoading:false,
    tenantLoading:false,
    appLoading:false,
    serviceLoading:false,
    clusterData:[],
    gatewayData:[],
    appStatus:true,
    serviceStatus:true,
    tenantStatus:true,
    clusterStatus:true
  }
  componentDidMount(){
    this.setState({
      clusterLoading:true,
      tenantLoading:true,
      appLoading:true,
      serviceLoading:true
    })
  }
  //获取集群信息，通过子组件clusters返回集群信息
  onClusterInfo = (clusterData = {},status) =>{
    this.setState({
      clusterCount:clusterData.clusterCount,
      hostCount:clusterData.hostCount,
      cpus:clusterData.cpus?parseInt(clusterData.cpus/1000,10):"--",
      cpuTotal:clusterData.cpuTotal?parseInt(clusterData.cpuTotal/1000,10):"--",
      rams:clusterData.rams?parseInt(clusterData.rams/1024/1024/1024,10):"--",
      ramsTotal:clusterData.ramsTotal?parseInt(clusterData.ramsTotal/1024/1024/1024,10):"--",
      clusterLoading:false,
      clusterStatus:status
    });
  }
  //获取租户及应用，服务数量信息，通过子组件tenantlist返回
  onGetTenantData=(data,loading,status)=>{
    if(loading === 'app'){
      this.setState({
        ...data,
        appLoading:false,
        appStatus:status
      })
    }else if(loading === 'service'){
      this.setState({
        ...data,
        serviceLoading:false,
        serviceStatus:status
      })
    }else{
      this.setState({
        ...data,
        tenantLoading:false,
        appLoading:false,
        tenantStatus:status
      })
    }
  }
  renderCluster = ()=>{
    const { 
      // cpus,cpuTotal,rams,ramsTotal,
      clusterCount,hostCount } = this.state;
    const resourceTotal = (
      <span>
        {clusterCount?clusterCount:0}<span style={{fontSize:14,marginRight:18}}>集群</span>
        {hostCount?hostCount:0}<span style={{fontSize:14}}>主机</span>
      </span>
    )
    return(
      <ChartCard
        title="资源情况"
        action={this.state.clusterStatus?<Tooltip title="平台管理的集群与主机数量及CPU、内存使用统计"><Icon type="info-circle-o" /></Tooltip>:<Tooltip title="获取集群信息失败!"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        total={resourceTotal} >
        <div style={{marginTop:24,width:'100%',height:21}}>
          {/* <Row style={{marginBottom:8}}>
            <Col span={12}><span>CPU</span><span style={{marginLeft:8}}>{formateValue(cpus)}/{formateValue(cpuTotal)}</span></Col>
            <Col span={12}><span>内存</span><span style={{marginLeft:8}}>{formateValue(rams)}/{formateValue(ramsTotal)}</span></Col>
          </Row>  */}
        </div>
      </ChartCard>
    )
  }
  renderTenant = ()=>{
    const { 
      tenantCount,
      // userCount 
    } = this.state;
    return(
      <ChartCard
        title="租户"
        action={this.state.tenantStatus?<Tooltip title="平台支持的租户数量和用户数量统计"><Icon type="info-circle-o" /></Tooltip>:<Tooltip title="获取租户及用户统计数据失败！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        total={formateValue(tenantCount)} >
        <div style={{marginTop:24,width:'100%',height:21}}>
          {/* <Row style={{marginBottom:8}}>
            <Col span={12}><span>用户</span><span style={{marginLeft:8}}>{formateValue(userCount)}</span></Col>
          </Row> */}
        </div>
      </ChartCard>
    )
  }
  renderApp = ()=>{
    const { appCount,middlewareCount } = this.state;
    const appTotal = (
      <span>
        {appCount?appCount:0}<span style={{fontSize:14,marginRight:18}}>应用</span>
        {middlewareCount?middlewareCount:0}<span style={{fontSize:14}}>中间件</span>
      </span>
    )
    return(
      <ChartCard
        title="应用-中间件"
        action={this.state.appStatus?<Tooltip title="平台管理的应用数量及应用状态统计"><Icon type="info-circle-o" /></Tooltip>:<Tooltip title="获取应用及中间件统计数据失败！"><Icon type="info-circle-o"  theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        total={appTotal} >
        <div style={{marginTop:24,width:'100%'}}>
          <Row style={{marginBottom:8,height:21}}>
            {/* <Col span={12}><span>正常</span><span style={{marginLeft:8}}>100</span></Col>
            <Col span={12}><span>异常</span><span style={{marginLeft:8}}>2</span></Col> */}
          </Row>
        </div>
      </ChartCard>
    )
  }
  renderService = ()=>{
    const { serviceCount } = this.state;
    return(
      <ChartCard
        title="服务总数"
        action={this.state.serviceStatus?<Tooltip title="平台管理的服务数量及服务状态统计"><Icon type="info-circle-o" /></Tooltip>:<Tooltip title="获取服务统计数据失败！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        total={formateValue(serviceCount)} >
        <div style={{marginTop:24,width:'100%'}}>
          <Row style={{marginBottom:8,height:21}}>
          </Row>
        </div>
      </ChartCard>
    )
  }
  render(){
    const { 
      clusterLoading,tenantLoading,appLoading,serviceLoading
    } = this.state;
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            { clusterLoading ?
              <Spin >
                { this.renderCluster() }
              </Spin> : this.renderCluster()
            }
          </Col>
          <Col {...topColResponsiveProps}>
            { tenantLoading ?
              <Spin >
                { this.renderTenant() }
              </Spin> : this.renderTenant()
            }
          </Col>
          <Col {...topColResponsiveProps}>
            { appLoading ?
              <Spin >
                { this.renderApp() }
              </Spin> : this.renderApp()
            }
          </Col>
          <Col {...topColResponsiveProps}>
            { serviceLoading ?
              <Spin >
                { this.renderService() }
              </Spin> : this.renderService()
            }
          </Col>
        </Row>
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{marginBottom:24}}>
          <Clusters  onClusterInfo={this.onClusterInfo}/>
        </Card>
        <TenantList onGetTenantData={this.onGetTenantData} />
        {/* <Card bordered={false} bodyStyle={{ padding: 0 }} style={{marginTop:24}}>
          <GatewayDash />
        </Card> */}
      </Fragment>
    )
  }
}

export default Dashboard;