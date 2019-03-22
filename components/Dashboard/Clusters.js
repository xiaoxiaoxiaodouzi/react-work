import React, { Component, Fragment } from 'react';
import { Row, Col, Card, Icon, Tooltip,message } from 'antd';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import constants from '../../services/constants';
import { base } from '../../services/base'
import { queryAppAIP } from '../../services/aip';
import {GrafanaModal} from '../../common/SimpleComponents'
import { allClusterInfo, getClusterInfoByTenant } from '../../services/monit';
import ServicesTable from '../../common/ServicesTable';
import './Overview.less';

class ClustersDash extends Component {
  state = {
    operationkey: '',
    cluster: [],
    loading: true,
    grafanaNodeVisible:false,
    expandedRowKeys: [],
    status:true,
    clusterData : []
  };
  lastOperationkey = '';
  operationTabList = [];

  componentWillReceiveProps(nextProps){
    if(nextProps.tenant !== this.props.tenant){
      this.loadData();
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData = ()=>{
    this.operationTabList = [];
    //根据isTenant判断是否是全局监控的集群信息还是资源监控的集群信息，istenant=true表示资源监控的集群信息，需要根据租户查询
    if (this.props.isTenant) {
      let successNode = '';
      let warningNode = '';
      let errorNode = '';
      //应用状态还没有接口，等待接口查询！！！
      let successApp = 0;
      let warningApp = 0;
      let errorApp = 0;
      let appTotal = 0;
      //根据租户获取集群信息
      getClusterInfoByTenant().then(data => {
        //发完请求之后把所有初始值设置为0
        successNode = 0;
        warningNode = 0;
        errorNode = 0;
        successApp = 0;
        warningApp = 0;
        errorApp = 0;
        appTotal = 0; 
        data.forEach(cluster => {
          let id = Math.random().toString();
          cluster.id = id;
          errorApp += cluster.appRedNum;
          warningApp += cluster.appYellowNum;
          appTotal += cluster.appTotalNum;
          this.operationTabList.push({ key: id, tab: cluster.name });
          cluster.containInfos.forEach(element => {
           
            let status = 0;
            if (element.cpu < constants.PROGRESS_STATUS[0] && element.memory < constants.PROGRESS_STATUS[0]) {
              successNode++;
            } else if (
              (element.cpu >= constants.PROGRESS_STATUS[0]
                && element.cpu < constants.PROGRESS_STATUS[1])
              || (element.memory >= constants.PROGRESS_STATUS[0]
                && element.memory < constants.PROGRESS_STATUS[1])
            ) {
              warningNode++;
              status = 1;
            } else {
              errorNode++;
              status = 2;
            }
            element.status = status;
          });
        });

        successApp = appTotal - warningApp - errorApp;
        this.props.onHostAndAppInfo({
          clusterTotal: data.length,
          successNode,
          warningNode,
          errorNode,
          appTotal,
          successApp,
          warningApp,
          errorApp
        },true);
        this.setState({ loading: false, operationkey: data[0]?data[0].id:null, cluster: data[0],clusterData:data });
      }).catch(err=>{
        this.setState({status:false,loading:false})
        this.props.onHostAndAppInfo({
          clusterTotal: "--",
          successNode,
          warningNode,
          errorNode,
          appTotal,
          successApp,
          warningApp,
          errorApp
        },false);
      })
    } else {
      //获取全部集群信息
       let hostCount = 0;
        let cpus = 0;
        let cpuTotal = 0;
        let rams = 0;
        let ramsTotal = 0;
       
      allClusterInfo().then(data => {
        data.forEach(cluster => {
          let id = Math.random().toString();
          cluster.id = id;
          hostCount += cluster.sub.length;
          cpus += parseInt(cluster.cpuUsed, 10);
          cpuTotal += parseInt(cluster.cpuTotal, 10);
          rams += parseInt(cluster.memoryUsed, 10);
          ramsTotal += parseInt(cluster.memoryTotal, 10);
          this.operationTabList.push({ key: cluster.id, tab: cluster.name });
        });
        this.props.onClusterInfo({ clusterCount: data.length, hostCount, cpus, cpuTotal, rams, ramsTotal },true);
        this.setState({ loading: false, operationkey: data[0]?data[0].id:null, cluster: data[0],clusterData:data });
      }).catch(err =>{
        this.setState({status:false,loading:false})
        this.props.onClusterInfo({ clusterCount: 0, hostCount, cpus:"", cpuTotal:"", rams:"", ramsTotal:"" },false);
      })
    }
  }

  onAppDetail = (code) => {
    queryAppAIP(code).then(data => {
      if (data.length > 0) {
        this.props.history.push({ pathname: `/apps/${data[0].id}` });
      } else {
        message.info('未获取到该应用相关信息，无法查看应用详情');
      }
    })
  }

  //渲染集群tab页的内容
  renderTabContent = () => {
    let clusterTemp = [];
    let appsCountTemp = 0;
    if(this.state.clusterData && this.state.clusterData.length > 0){
      if (this.state.operationkey && this.state.operationkey !== this.lastOperationkey) {
        //根据operationkey重新获取集群数据显示
        this.lastOperationkey = this.state.operationkey;
        this.state.clusterData.forEach(element => {
          if (element.id === this.state.operationkey) {
            clusterTemp = element;
          }
        })
        clusterTemp.containInfos.forEach(element => {
          let dockerVersion = element.containerRuntimeVersion;
          element.dockerVersion = dockerVersion.slice(dockerVersion.indexOf('://') + 3);
          element.totalCPU = element.cpuTotal / 1000 ;
          element.totalMemory = (element.memoryTotal / 1024 / 1024 / 1024).toFixed(0) ;
          /* if(element.nodeDetail && element.nodeDetail.apps){
            appsCountTemp += element.nodeDetail.apps.length;
          } */
          let status = 0;
          if ((element.cpu >= constants.PROGRESS_STATUS[0]
            && element.cpu < constants.PROGRESS_STATUS[1])
            || (element.memory >= constants.PROGRESS_STATUS[0]
              && element.memory < constants.PROGRESS_STATUS[1])) {
            status = 1;
          } else if (element.cpu > constants.PROGRESS_STATUS[1]
            || element.memory > constants.PROGRESS_STATUS[1]) {
            status = 2;
          }
          element.status = status;
          // element.nodeStatus = status;
          element.nodeCpuRate = element.cpu;
          element.nodeCPU = element.totalCPU;
          element.nodeMem = element.totalMemory;
          element.nodeMemRate = element.memory;
        })
        this.setState({ cluster: clusterTemp, appsCount: appsCountTemp });
      }
      const { cluster } = this.state;
      const topColResponsiveProps = { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, style: { marginBottom: 24 } };
      return (
        <Fragment>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              <ChartCard
                avatar={(
                  <img
                    alt="indicator"
                    style={{ width: 56, height: 56 }}
                    src={constants.PIC.cpu}
                  />
                )}
                title={<Fragment><span style={{ marginRight: 16 }}>CPU总量</span><Tooltip title="当前集群各主机CPU核数总和"><Icon type="info-circle-o" /></Tooltip></Fragment>}
                total={cluster.cpuTotal?(parseInt(cluster.cpuTotal, 10) / 1000 + '核'):'--'}
                contentHeight={46} />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                avatar={(
                  <img
                    alt="indicator"
                    style={{ width: 56, height: 56 }}
                    src={constants.PIC.ram}
                  />
                )}
                title={<Fragment><span style={{ marginRight: 16 }}>内存总量</span><Tooltip title="当前集群内各主机内存总和"><Icon type="info-circle-o" /></Tooltip></Fragment>}
                total={cluster.memoryTotal?((parseInt(cluster.memoryTotal, 10) / 1024 / 1024 / 1024).toFixed(0) + 'GB'):'--'}
                contentHeight={46} />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                avatar={(
                  <img
                    alt="indicator"
                    style={{ width: 56, height: 56 }}
                    src={constants.PIC.app}
                  />
                )}
                title={<Fragment><span style={{ marginRight: 16 }}>应用</span><Tooltip title="当前集群所运行的业务应用数量"><Icon type="info-circle-o" /></Tooltip></Fragment>}
                total={cluster.appTotalNum || '0'}
                contentHeight={46} />
            </Col>
            <Col {...topColResponsiveProps}>
              <ChartCard
                avatar={(
                  <img
                    alt="indicator"
                    style={{ width: 56, height: 56 }}
                    src={constants.PIC.middleware}
                  />
                )}
                title={<Fragment><span style={{ marginRight: 16 }}>中间件</span><Tooltip title="当前集群所运行的中间件数量"><Icon type="info-circle-o" /></Tooltip></Fragment>}
                total={cluster.middlewareCount?cluster.middlewareCount:'0'}
                contentHeight={46} />
            </Col>
          </Row>
          <ServicesTable nodeDetailList={cluster.containInfos} opType='look' {...this.props} {...this.state}/>
        </Fragment>
      )
    }
  }
  render() {
    return (
     this.state.clusterData && this.state.clusterData.length>0? <Card
        loading={this.state.loading}
        style={{ width: '100%' }}
        tabList={this.operationTabList}
        activeTabKey={this.state.operationkey}
        onTabChange={(key) => this.setState({ operationkey: key, expandedRowKeys: [] })} >
        {this.renderTabContent()}
        <GrafanaModal visible={this.state.grafanaNodeVisible} title="节点资源监控" onCancel={e=>{this.setState({grafanaNodeVisible:false})}} url={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.node+'&var-node='+this.state.ip}/>
      </Card>:
      <Card loading={this.state.loading} style={{ width: '100%',height:182 }}>
        <div style={{float:'right'}}>
          <Tooltip title={this.state.status?"无集群数据":"获取集群数据失败！"}><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip></div>
        <div style={{color:'#d4d4d4',textAlign:'center',marginTop:50,fontSize:16}}>无集群数据</div>
      </Card>
    );
  }
}
export default ClustersDash;