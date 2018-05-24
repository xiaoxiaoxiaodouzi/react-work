import React, { Fragment } from 'react';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Card,Tooltip,Spin } from 'antd';
import GatewayDash from '../../components/Dashboard/GatewayDash';
import ClustersDash from '../../components/Dashboard/ClustersDash';
import TenantList from '../../components/Dashboard/TenantList';
import {allClusterInfo,getAppCount,getServiceCount,tenantsNodes,getApigatewayApp,getAppMonit,getClusterNode} from '../../services/monitor'
import {base} from '../../services/base'
import '../Application/Overview.less';

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
  }
  componentDidMount(){
    this.setState({
      clusterLoading:true,
      tenantLoading:true,
      appLoading:true,
      serviceLoading:true
    })
    //集群数据
    allClusterInfo().then(data=>{
      // console.log("allClusterInfo",data);
      let hostCount =0;
      let cpus = 0;
      let cpuTotal = 0;
      let rams = 0;
      let ramsTotal = 0;
      let requestApps = [];
      let requestMiddlewares = [];
      data.forEach(element=>{
        hostCount += element.sub.length;
        cpus += parseInt(element.cpuUsed,10);
        cpuTotal += parseInt(element.cpuTotal,10);
        rams += parseInt(element.memoryUsed,10);
        ramsTotal += parseInt(element.memoryTotal,10);
        // requestApps.push(getAppCount({cluster:element.name}));
        // requestMiddlewares.push(getAppCount({cluster:element.name,type:'middleware'}))
      });
      Promise.all(requestApps).then(values=>{
        // console.log('appCount',values);
        values.forEach((element,index)=>{
          data[index].appCount = element;
        });
        this.setState({ clusterData:data });
      });
      Promise.all(requestMiddlewares).then(values=>{
        // console.log('middlewareCount',values);
        values.forEach((element,index)=>{
          data[index].middlewareCount = element;
        });
        this.setState({ clusterData:data }); 
      });
      this.setState({
        clusterCount:data.length,
        hostCount,
        cpus:parseInt(cpus/1000,10),
        cpuTotal:parseInt(cpuTotal/1000,10),
        rams:parseInt(rams/1024/1024/1024,10),
        ramsTotal:parseInt(ramsTotal/1024/1024/1024,10),
        clusterLoading:false,
      });
      tenantsNodes().then(nodes=>{
        let requestNodes = [];
        // console.log("tenantsNodes",nodes);
        nodes.forEach(node=>{
          requestNodes.push(getClusterNode(node.name));
        });
        Promise.all(requestNodes).then(values=>{
          values.forEach((element,index)=>{
            nodes[index].nodeDetail = element;
          });
          // console.log('nodes',nodes);
          nodes.forEach(node=>{
            data.forEach(cluster=>{
              cluster.containInfos.forEach(element=>{
                if(node.name === element.nodeName){
                  let dockerVersion = node.nodeInfo.containerRuntimeVersion;
                  element.dockerVersion = dockerVersion.slice(dockerVersion.indexOf('://')+3);
                  element.totalCPU = node.totalCPU;
                  element.totalMemory = node.totalMemory;
                  element.nodeDetail = node.nodeDetail;
                }
              })
            })
          });
          this.setState({ clusterData:data }); 
        });
      });
    }).catch(err=>{
      this.setState({ clusterLoading:false });
    })
    //应用数
    getAppCount(null,{'AMP-ENV-ID':'82dzJh8dROWprfsE228g-A'}).then(data=>{
      this.setState({ appCount:data,appLoading:false });
    }).catch(err=>{
      this.setState({ appLoading:false });
    })
    //服务数
    getServiceCount().then(data=>{
      this.setState({serviceCount:data,serviceLoading:false});
    }).catch(err=>{
      this.setState({ serviceLoading:false });
    })
    //环境
    console.log('xxx',base.environments);
  }
  onGetTenantCount=(tenantCount)=>{
    this.setState({tenantCount});
  }
  onGetUserCount = (userCount)=>{
    this.setState({userCount,tenantLoading:false});
  }
  renderCluster = ()=>{
    const { cpus,cpuTotal,rams,ramsTotal,clusterCount,hostCount } = this.state;
    const resourceTotal = (
      <span>
        {clusterCount}<span style={{fontSize:14,marginRight:18}}>集群</span>
        {hostCount}<span style={{fontSize:14}}>主机</span>
      </span>
    )
    return(
      <ChartCard
        title="资源情况"
        action={<Tooltip title="平台管理的集群与主机数量及CPU、内存使用统计"><Icon type="info-circle-o" /></Tooltip>}
        total={resourceTotal} >
        <div style={{marginTop:24,width:'100%'}}>
          <Row style={{marginBottom:8}}>
            <Col span={12}><span>CPU</span><span style={{marginLeft:8}}>{cpus}/{cpuTotal}</span></Col>
            <Col span={12}><span>内存</span><span style={{marginLeft:8}}>{rams}/{ramsTotal}</span></Col>
          </Row> 
        </div>
      </ChartCard>
    )
  }
  renderTenant = ()=>{
    const { tenantCount,userCount } = this.state;
    return(
      <ChartCard
        title="租户"
        action={<Tooltip title="平台支持的租户数量和用户数量统计"><Icon type="info-circle-o" /></Tooltip>}
        total={tenantCount} >
        <div style={{marginTop:24,width:'100%'}}>
          <Row style={{marginBottom:8}}>
            <Col span={12}><span>用户</span><span style={{marginLeft:8}}>{userCount}</span></Col>
          </Row>
        </div>
      </ChartCard>
    )
  }
  renderApp = ()=>{
    const { appCount } = this.state;
    return(
      <ChartCard
        title="应用"
        action={<Tooltip title="平台管理的应用数量及应用状态统计"><Icon type="info-circle-o" /></Tooltip>}
        total={appCount} >
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
        action={<Tooltip title="平台管理的服务数量及服务状态统计"><Icon type="info-circle-o" /></Tooltip>}
        total={serviceCount} >
        <div style={{marginTop:24,width:'100%'}}>
          <Row style={{marginBottom:8,height:21}}>
          </Row>
        </div>
      </ChartCard>
    )
  }
  render(){
    const { 
      clusterLoading,tenantLoading,appLoading,serviceLoading,clusterData
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
        <TenantList onGetTenantCount={this.onGetTenantCount} onGetUserCount={this.onGetUserCount} />
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{marginTop:24}}>
          <GatewayDash />
        </Card>
        <Card bordered={false} bodyStyle={{ padding: 0 }} style={{marginTop:24}}>
          <ClustersDash clusterData={clusterData} />
        </Card>
      </Fragment>
    )
  }
}

export default Dashboard;