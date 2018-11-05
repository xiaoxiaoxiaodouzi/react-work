import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { Row, Col, Card, Icon, Tooltip, Table, Progress, Badge, Divider, message, Spin } from 'antd';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import constants from '../../services/constants';
import { base } from '../../services/base'
import { queryAppAIP } from '../../services/deploy';
import {
  allClusterInfo, getClusterInfoByTenant, getClusterNode
} from '../../services/monitor';
import './Overview.less';

const statusMap = ['success', 'warning', 'error'];
const status = ['正常', '警告', '严重'];

class ClustersDash extends Component {
  state = {
    operationkey: '',
    cluster: [],
    loading: true,
    appLoading: false,
    expandedRowKeys: [],
  };
  lastOperationkey = '';
  nodes = [];
  clusterData = [];
  operationTabList = [];

  componentDidMount() {
    //根据isTenant判断是否是全局监控的集群信息还是资源监控的集群信息，istenant=true表示资源监控的集群信息，需要根据租户查询
    if (this.props.isTenant) {
      let successNode = '';
      let warningNode = '';
      let errorNode = '';
      //应用状态还没有接口，等待接口查询！！！
      let successApp = '--';
      let warningApp = '--';
      let errorApp = '--';
      let appTotal = '--';
      //根据租户获取集群信息
      getClusterInfoByTenant().then(data => {
        this.clusterData = data;
        //发完请求之后把所有初始值设置为0
        successNode = 0;
        warningNode = 0;
        errorNode = 0;
        /* successApp = 0;
        warningApp = 0;
        errorApp = 0;
        appTotal = 0; */
        data.forEach(cluster => {
          let id = Math.random().toString();
          cluster.id = id;
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
        this.props.onHostAndAppInfo({
          clusterTotal: data.length,
          successNode,
          warningNode,
          errorNode,
          appTotal,
          successApp,
          warningApp,
          errorApp
        });
        this.setState({ loading: false, operationkey: data[0].id, cluster: data[0] });
      })
    } else {
      //获取全部集群信息
      allClusterInfo().then(data => {
        let hostCount = 0;
        let cpus = 0;
        let cpuTotal = 0;
        let rams = 0;
        let ramsTotal = 0;
        this.clusterData = data;
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
        this.props.onClusterInfo({ clusterCount: data.length, hostCount, cpus, cpuTotal, rams, ramsTotal });
        this.setState({ loading: false, operationkey: data[0].id, cluster: data[0] });
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
  onRowExpand = (expanded, record) => {
    if (expanded) {
      this.setState({ appLoading: true });
      let clusterTemp = this.state.cluster;
      let params = !this.props.isTenant ? record.nodeName : record.nodeName + `?tenant=${base.tenant}`;
      getClusterNode(params).then(data => {
        clusterTemp.containInfos.forEach(element => {
          if (element.nodeName === data.nodeName) {
            element.nodeDetail = data
          }
        })
        this.setState({ cluster: clusterTemp, appLoading: false })
      })
    }
  }
  //渲染表格扩展的内容，传入表格行数据
  renderExpandContent = (record) => {
    const { appLoading } = this.state;
    if (appLoading) {
      return <Spin />
    } else if (record.nodeDetail) {
      return (
        <Fragment>
          {record.nodeDetail.k8scontainers &&
            <Row>
              {
                record.nodeDetail.k8scontainers.map((element, index) => {
                  let status = 'success';
                  let title = (
                    <p key={index}>
                      <span>CPU限值：{element.cpuTotal ? element.cpuTotal / 1000 + '核' : '未限定'}</span><br />
                      <span>内存限值：{element.memoryTotal ? (element.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
                      <span>CPU使用率：{element.cpu}%</span><br />
                      <span>内存使用率：{element.memory}%</span><br />
                    </p>
                  )
                  if ((element.cpu >= constants.PROGRESS_STATUS[0]
                    && element.cpu < constants.PROGRESS_STATUS[1])
                    || (element.memory >= constants.PROGRESS_STATUS[0]
                      && element.memory < constants.PROGRESS_STATUS[1])) {
                    status = 'warning';
                  } else if (element.cpu > constants.PROGRESS_STATUS[1]
                    || element.memory > constants.PROGRESS_STATUS[1]) {
                    status = 'error';
                  }
                  return (
                    <Col key={index} span={6}>
                      <Badge status={status} />
                      <Tooltip title={title}>
                        <span style={{ marginRight: 48 }}>{element.name}</span>
                      </Tooltip>
                    </Col>
                  )
                })
              }
            </Row>
          }
          <Divider style={{ marginBottom: 8, marginTop: 8 }} />
          {record.nodeDetail.apps &&
            <Row>
              {
                record.nodeDetail.apps.map((element, index) => {
                  let status = 'success';
                  let title = null;
                  let flag = false;
                  let name = element.containers[0].name.split('#')[0];
                  element.containers.forEach(item => {
                    if (item.name.split('#')[0] !== name) {
                      flag = true;
                    }
                    if (status !== 'error' &&
                      ((item.cpu >= constants.PROGRESS_STATUS[0]
                        && item.cpu < constants.PROGRESS_STATUS[1])
                        || (item.memory >= constants.PROGRESS_STATUS[0]
                          && item.memory < constants.PROGRESS_STATUS[1]))
                    ) {
                      status = 'warning';
                    } else if (item.cpu > constants.PROGRESS_STATUS[1]
                      || item.memory > constants.PROGRESS_STATUS[1]) {
                      status = 'error';
                    }
                  })
                  if (!flag) {
                    title = (
                      <p>
                        {element.containers.map((item, index) => {
                          return (
                            <span key={index} >{item.name.split('#')[1]}：<br />
                              <span style={{ marginLeft: 24 }}>CPU限值：{item.cpuTotal ? item.cpuTotal / 1000 + '核' : '未限定'}</span><br />
                              <span style={{ marginLeft: 24 }}>内存限值：{item.memoryTotal ? (item.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
                              <span style={{ marginLeft: 24 }}>CPU使用率：{item.cpu}%</span><br />
                              <span style={{ marginLeft: 24 }}>内存使用率：{item.memory}%</span><br />
                            </span>
                          )
                        })
                        }
                      </p>
                    )
                  } else {
                    title = (
                      <p>
                        {element.containers.map((item, index) => {
                          return (
                            <span key={index} >{item.name.split('#')[1]}(实例{index + 1})：<br />
                              <span style={{ marginLeft: 24 }}>CPU限值：{item.cpuTotal ? item.cpuTotal / 1000 + '核' : '未限定'}</span><br />
                              <span style={{ marginLeft: 24 }}>内存限值：{item.memoryTotal ? (item.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'GB' : '未限定'}</span><br />
                              <span style={{ marginLeft: 24 }}>CPU使用率：{item.cpu}%</span><br />
                              <span style={{ marginLeft: 24 }}>内存使用率：{item.memory}%</span><br />
                            </span>
                          )
                        })
                        }
                      </p>
                    )
                  }
                  return (
                    <Col key={index} span={6}>
                      <Badge status={status} />
                      <Tooltip title={title}>
                        <span onClick={() => this.onAppDetail(element.appCode, element)} style={{ marginRight: 48, cursor: 'pointer' }}>{element.appName}</span>
                      </Tooltip>
                    </Col>
                  )
                })
              }
            </Row>
          }
        </Fragment>
      )
    }
  }
  //渲染集群tab页的内容
  renderTabContent = () => {
    let clusterTemp = [];
    let appsCountTemp = 0;
    if (this.state.operationkey && this.state.operationkey !== this.lastOperationkey) {
      //根据operationkey重新获取集群数据显示
      this.lastOperationkey = this.state.operationkey;
      this.clusterData.forEach(element => {
        if (element.id === this.state.operationkey) {
          clusterTemp = element;
        }
      })
      clusterTemp.containInfos.forEach(element => {
        let dockerVersion = element.containerRuntimeVersion;
        element.dockerVersion = dockerVersion.slice(dockerVersion.indexOf('://') + 3);
        element.totalCPU = element.cpuTotal / 1000 + '核';
        element.totalMemory = (element.memoryTotal / 1024 / 1024 / 1024).toFixed(0) + 'G';
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
      })
      this.setState({ cluster: clusterTemp, appsCount: appsCountTemp });
    }
    const { cluster } = this.state;
    const columns = [{
      title: '主机', dataIndex: 'nodeName', width: '20%'
    }, {
      title: '状态', dataIndex: 'status', width: '10%',
      render: (text, record) => {
        return <Badge status={statusMap[text]} text={status[text]} />;
      }
    }, {
      title: 'Docker版本', dataIndex: 'dockerVersion', width: '10%'
    }, {
      title: 'CPU', dataIndex: 'totalCPU', width: '10%'
    }, {
      title: 'CPU使用率', dataIndex: 'cpu', width: '20%',
      render: (value, record) => {
        value = parseInt(value, 10);
        if (value < constants.PROGRESS_STATUS[0]) {
          return <Progress percent={value} status='normal' className='normal' />
        } else if (value >= constants.PROGRESS_STATUS[0] && value < constants.PROGRESS_STATUS[1]) {
          return <Progress percent={value} status='normal' className='warning' />
        } else {
          return <Progress percent={value} status='normal' className='danger' />
        }
      }
    }, {
      title: '内存', dataIndex: 'totalMemory', width: '10%'
    }, {
      title: '内存使用率', dataIndex: 'memory', width: '20%',
      render: (value, record) => {
        value = parseInt(value, 10);
        if (value < constants.PROGRESS_STATUS[0]) {
          return <Progress percent={value} status='normal' className='normal' />
        } else if (value >= constants.PROGRESS_STATUS[0] && value < constants.PROGRESS_STATUS[1]) {
          return <Progress percent={value} status='normal' className='warning' />
        } else {
          return <Progress percent={value} status='normal' className='danger' />
        }
      }
    }];
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
              total={parseInt(cluster.cpuTotal, 10) / 1000 + '核'}
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
              total={(parseInt(cluster.memoryTotal, 10) / 1024 / 1024 / 1024).toFixed(0) + 'GB'}
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
              total={cluster.appTotalNum || '--'}
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
              total='--'/* cluster.middlewareCount */
              contentHeight={46} />
          </Col>
        </Row>
        <Table
          size={'middle'}
          columns={columns}
          pagination={false}
          onExpand={this.onRowExpand}
          expandedRowKeys={this.state.expandedRowKeys}
          onExpandedRowsChange={(expandedRows) => this.setState({ expandedRowKeys: expandedRows })}
          expandedRowRender={record => this.renderExpandContent(record)}
          dataSource={cluster.containInfos}
        />
      </Fragment>
    )
  }
  render() {
    return (
      <Card
        loading={this.state.loading}
        style={{ width: '100%' }}
        tabList={this.operationTabList}
        activeTabKey={this.state.operationkey}
        onTabChange={(key) => this.setState({ operationkey: key, expandedRowKeys: [] })} >
        {this.renderTabContent()}
      </Card>
    );
  }
}
export default withRouter(ClustersDash);