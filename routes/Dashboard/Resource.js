import React from 'react'
import { Row,Col,Icon,Tooltip,Spin } from 'antd';
import { ChartCard,Field,MiniBar,MiniArea } from 'ant-design-pro/lib/Charts';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import ClustersDash from '../../components/Dashboard/ClustersDash';
import moment from 'moment';
import { getAppCount,getClusterInfoByTenant,tenantsNodes,getClusterNode,appPvUv } from '../../services/monitor'

import constants from '../../services/constants';

const breadcrumbList = [{
  title: '首页',
  href: '#/',
},{
  title: '资源监控'
}];

class ResourceDashboard extends React.Component {
  state = {
    clusterData:[],
    pvData:[],
    uvData:[],
    pvTotal:0,
    uvTotal:0,
    pvToday:0,
    uvToday:0,
    successNode:0,
    warningNode:0,
    errorNode:0,
    successApp:0,
    warningApp:0,
    errorApp:0,
    clusterTotal:0,
    appTotal:0,
    hostLoading:false,
    appLoading:false,
  }
  componentDidMount(){
    let successNode = 0;
    let warningNode = 0;
    let errorNode = 0;
    let successApp = 0;
    let warningApp = 0;
    let errorApp = 0;
    let appTotal = 0;
    this.setState({hostLoading:true,appLoading:true});
    getClusterInfoByTenant().then(data=>{
      let requestApps = [];
      let requestMiddlewares = [];
      data.forEach(element=>{
        requestApps.push(getAppCount({cluster:element.name}));
        requestMiddlewares.push(getAppCount({cluster:element.name,type:'middleware'}))
      });
      Promise.all(requestApps).then(values=>{
        values.forEach((element,index)=>{
          data[index].appCount = element;
        });
        this.setState({ clusterData:data });
      });
      Promise.all(requestMiddlewares).then(values=>{
        values.forEach((element,index)=>{
          data[index].middlewareCount = element;
        });
        this.setState({ clusterData:data }); 
      });
      tenantsNodes().then(nodes=>{
        let requestNodes = [];
        nodes.forEach(node=>{
          requestNodes.push(getClusterNode(node.name));
        });
        Promise.all(requestNodes).then(values=>{
          values.forEach((element,index)=>{
            nodes[index].nodeDetail = element;
          });
          nodes.forEach(node=>{
            data.forEach(cluster=>{
              cluster.containInfos.forEach(element=>{
                if(node.name === element.nodeName){
                  let dockerVersion = node.nodeInfo.containerRuntimeVersion;
                  element.dockerVersion = dockerVersion.slice(dockerVersion.indexOf('://')+3);
                  element.totalCPU = node.totalCPU;
                  element.totalMemory = node.totalMemory;
                  element.nodeDetail = node.nodeDetail;
                  if(element.cpu < constants.PROGRESS_STATUS[0] && element.memory < constants.PROGRESS_STATUS[0]){
                    successNode ++;
                  }else if(
                    (element.cpu >= constants.PROGRESS_STATUS[0] 
                    && element.cpu < constants.PROGRESS_STATUS[1])
                    || (element.memory >= constants.PROGRESS_STATUS[0] 
                    && element.memory < constants.PROGRESS_STATUS[1])
                  ){
                    warningNode ++;  
                  }else{
                    errorNode ++;
                  }
                  appTotal += element.nodeDetail.apps.length;
                  element.nodeDetail.apps.forEach(item=>{
                    let flag = 0;
                    item.containers.forEach(constainer=>{
                      if(flag !== 2 &&
                        ((constainer.cpu >= constants.PROGRESS_STATUS[0] 
                        && constainer.cpu < constants.PROGRESS_STATUS[1])
                        || (constainer.memory >= constants.PROGRESS_STATUS[0] 
                        && constainer.memory < constants.PROGRESS_STATUS[1]))
                      ){
                        flag = 1;  
                      }else if(constainer.cpu > constants.PROGRESS_STATUS[1]
                        || constainer.memory > constants.PROGRESS_STATUS[1]
                      ){
                        flag = 2;  
                      }
                    })
                    if(flag === 0){
                      successApp ++;
                    }else if(flag === 1){
                      warningApp ++;
                    }else{
                      errorApp ++;
                    }
                  })
                }
              })
            })
          });
          this.setState({ 
            clusterData:data,clusterTotal:data.length,
            successNode,warningNode,errorNode,appTotal,
            successApp,warningApp,errorApp,hostLoading:false,appLoading:false
          }); 
        });
      });
    }).catch(err=>{
      this.setState({ hostLoading:false,appLoading:false });
    })

    let st = moment().subtract(7,'day').format('x');
    let et = moment().add(1,'day').format('x');
    appPvUv({startTime:st,endTime:et}).then(data=>{
      let tempData = [];
      console.log('pvuv',data);
      for(let i = 7;i >= 0; i--){
        tempData.push({
          date:moment().subtract(i,'day').format('YYYY-MM-DD'),
          pv:0,
          uv:0
        })
      }
      let uvData = [];
      let pvData = [];
      let pvToday = 0;
      let uvToday = 0;
      let pvTotal = 0;
      let uvTotal = 0;
      data.forEach(element=>{
        tempData.forEach(item=>{
          if(moment(element.date).format('YYYY-MM-DD') === item.date){
            item.pv = element.pv;
            item.uv = element.uv;
          }
          uvData.push({
            x:item.date,
            y:parseInt(item.uv,10)
          })
          pvData.push({
            x:item.date,
            y:parseInt(item.pv,10)
          })
        })
        pvTotal += parseInt(element.pv,10);
        uvTotal += parseInt(element.uv,10);
      })
      if(data.length > 0){
        pvToday = tempData[tempData.length-1].pv;
        uvToday = tempData[tempData.length-1].uv;
      }
      this.setState({ pvData,uvData,pvTotal,uvTotal,pvToday,uvToday });
    })
  }
  renderHost = ()=>{
    const { successNode,warningNode,errorNode,clusterTotal } = this.state;
    return(
      <ChartCard
        title="主机状态监控"
        action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        footer={<Field label="集群总数" value={clusterTotal}/>}
        contentHeight={88}
      >
      <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
        <Row style={{marginBottom:8}}>
          <Col span={8}><span>正常</span></Col>
          <Col span={8}><span>警告</span></Col>
          <Col span={8}><span>严重</span></Col>
        </Row>
        <Row>
          <Col span={8}><span>{successNode}</span></Col>
          <Col span={8}><span>{warningNode}</span></Col>
          <Col span={8}><span>{errorNode}</span></Col>
        </Row>
      </div>
      </ChartCard>
    )
  }
  renderApp=()=>{
    const { appTotal,successApp,warningApp,errorApp } = this.state;
    return (
      <ChartCard
        title="应用异常监控"
        action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
        footer={<Field label="应用总数" value={appTotal}/>}
        contentHeight={88}
      >
      <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
        <Row style={{marginBottom:8}}>
          <Col span={8}><span>正常</span></Col>
          <Col span={8}><span>警告</span></Col>
          <Col span={8}><span>严重</span></Col>
        </Row>
        <Row>
          <Col span={8}><span>{successApp}</span></Col>
          <Col span={8}><span>{warningApp}</span></Col>
          <Col span={8}><span>{errorApp}</span></Col>
        </Row>
      </div>
      </ChartCard>
    )
  }
  render() {
    const { 
      pvData,uvData,pvTotal,uvTotal,pvToday,uvToday,hostLoading,appLoading
    } = this.state;
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeader 
          breadcrumbList={breadcrumbList} 
          title='资源监控' />
          <div style={{margin:'24px 24px 0'}}>
            <Row gutter={24}>
              <Col {...topColResponsiveProps}>
              { hostLoading ?
                <Spin >
                  { this.renderHost() }
                </Spin> : this.renderHost()
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
                <ChartCard
                  title="访问量"
                  total={pvTotal}
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  footer={
                    <div>
                      <Field label="当日访问量" value={pvToday}/>
                    </div>}
                  contentHeight={46}
                >
                  <MiniArea color="#975FE4" data={pvData} />
                </ChartCard>
              </Col>
              <Col {...topColResponsiveProps}>
                <ChartCard
                  title="用户数"
                  total={uvTotal}
                  action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
                  footer={
                    <div>
                      <Field label="当日访问人数" value={uvToday}/>
                    </div>}
                  contentHeight={46}
                >
                  <MiniBar
                    height={46} data={uvData}
                  />
                </ChartCard>
              </Col>
            </Row>
            <ClustersDash clusterData={this.state.clusterData} />
        </div>
      </div>
    );
  }
}

export default ResourceDashboard;