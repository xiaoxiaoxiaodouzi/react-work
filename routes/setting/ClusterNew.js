import React, { Component } from 'react'
import { Card, Icon, Row, Col } from 'antd'
import {  getClusterList } from '../../services/cce';
import constants from '../../services/constants'
import PageHeaderLayout from './layouts/PageHeaderLayout'
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import {  BaseProgress } from '../../common/SimpleComponents'
import { getClusterDetail } from '../../services/monit';
import { getTenant } from '../../services/tp';
import ClusterServices from '../../common/ClusterServices';

class Cluster extends Component {
  state = {
    loading: false,
    clusterData: [],
    clusterDataCount: {},
    grafanaNodeVisible: false,
    visibleMaAdd: false,
    masterIP: '',     //masterIP
    token: '',       //cluster_token
    containerVisible: false,
    tenants: [],
    tenant: '',  //修改集群 选中的租户
    clusterVisible: false,
  }

  componentDidMount() {
    this.initDatas();
  }

  initDatas = () => {
    getTenant().then(data => {
      this.setState({ tenants: data })
    })

    //判断当前租户是否是管理租户
    // let config = base.configs;
    // if (config.manageTenantCode === base.tenant) {}
    // if (!base.isAdmin) {
    //   queryParam = {
    //     tenant: base.tenant
    //   }
    // }

    let containTotal = 0;
    let cpuTotal = 0;
    let cpuUsedTotal = 0;
    let memTotal = 0;
    let memUsedTotal = 0;
    let DiskTotal = 0;
    let usedDiskNumTotal = 0;
    this.setState({loading:true})
    getClusterList().then(data => {
      if (data.length > 0) {
        getClusterDetail().then(result => {
          //收集所有的节点详情
          let nodeList = [];
          result.forEach(j => {
            cpuTotal += parseInt(j.totalCpuNum, 10);
            cpuUsedTotal += parseInt(j.usedCpuNum, 10);
            memTotal += parseInt(j.totalMemNum, 10);
            memUsedTotal += parseInt(j.usedMemNum, 10);
            DiskTotal += parseInt(j.totalDiskNum, 10) || 0;
            usedDiskNumTotal += parseInt(j.usedDiskNum, 10);
            nodeList.push(...j.nodeList);
          })
          data.forEach(i => {
            i.nodeDetailList = [];
            containTotal += i.nodeList.length;
            i.nodeList.forEach(node => {
              //找到节点详情
              if (nodeList.length > 0) {
                nodeList.forEach(item => {
                  if (item.nodeName === node) {
                    //为了表格详情内的操作能够拿到clusterID
                    item.clusterId=i.id
                    i.nodeDetailList.push(item);
                  }
                })
              }
            })
          })
          const clusterDataCount = {
            hostCount: containTotal,
            cpuCount: cpuTotal + '核',
            cpuUsed: (cpuUsedTotal / cpuTotal).toFixed(2)*100,
            ramsCount: memTotal + 'G',
            ramsUsed:(memUsedTotal / memTotal).toFixed(2)*100,
            filesystemCount: (DiskTotal || '--')  + 'G',
            filesystemUsedTemp: (usedDiskNumTotal / DiskTotal).toFixed(2)*100,
            filesystemUsed: 0,//等待接口数据
          }
          this.setState({ clusterDataCount, clusterData: data ,loading:false})
        })
      }
    })
  }

  render() {
    let { clusterDataCount } = this.state;
    const breadcrumbList = [{ title: '平台管理' }, { title: '服务器' }];
    const content = (
      <div className='pageHeaderContent'>
        <p>管理应用专有云平台用于部署应用的所有服务器资源，您可以按使用场景，业务用途或者机器配置将服务器分成多个相互独立的服务器组</p>
        <div className='contentLink'>
          <a > <Icon type="file-word" /> 专有云服务接入文档 </a>
          <a > <Icon type="file-word" /> 服务器运维、配置参考手册 </a>
        </div>
      </div>
    );
    const extra = (
      <div className="imgContainer">
        <img style={{ width: 120 }} alt="服务器" src={constants.PIC.pc} />
      </div>
    );
    
    return (
      <PageHeaderLayout
        title='服务器'
        content={content}
        extraContent={extra}
        breadcrumbList={breadcrumbList}
      >
        <Card className="cluster-use-card" bordered={false}>
          <Row>
            <Col span={6}>
              <img alt="服务器" src={constants.PIC.cpu} />
              <div className="title">服务器</div>
              <div className="val" style={{ height: 42, lineHeight: '42px' }}>{clusterDataCount.hostCount}台</div>
            </Col>
            <Col span={6}>
              <img alt="CPU" src={constants.PIC.cpu} />
              <div className="title">CPU</div>
              <div><span className="lable">总量</span> <span className="val">{clusterDataCount.cpuCount}</span></div>
              <div><span className="lable">负载</span> <BaseProgress percent={clusterDataCount.cpuUsed} style={{ width: 'calc(100% - 162px)' }} /></div>
            </Col>
            <Col span={6}>
              <img alt="内存" src={constants.PIC.ram} />
              <div className="title">内存</div>
              <div><span className="lable">总量</span> <span className="val">{clusterDataCount.ramsCount}</span></div>
              <div><span className="lable">用量</span> <BaseProgress percent={clusterDataCount.ramsUsed} style={{ width: 'calc(100% - 162px)' }} /></div>
            </Col>
            <Col span={6}>
              <img alt="磁盘" src={constants.PIC.middleware} />
              <div className="title">磁盘</div>
              <div><span className="lable">总量</span> <span className="val">{clusterDataCount.filesystemCount}</span></div>
              <div><span className="lable">用量</span>  <BaseProgress percent={clusterDataCount.filesystemUsed} style={{ width: 'calc(100% - 162px)' }} /></div>
            </Col>
          </Row>
        </Card>
        <ClusterServices clusterData={this.state.clusterData} {...this.props} {...this.state} initDatas={this.initDatas}/>
      </PageHeaderLayout>
    )
  }
}

export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <Cluster {...props} tenant={context.tenant} />}
  </GlobalHeaderContext.Consumer>
);
