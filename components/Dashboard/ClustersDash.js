import React,{ Component,Fragment } from 'react';
import { Row,Col,Card,Icon,Tooltip,Table,Progress,Badge,Divider } from 'antd';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import constants from '../../services/constants'
import './Overview.less';

const statusMap = [ 'success', 'warning',  'error' ];
const status = [ '正常', '告警', '危险' ];

export default class ClustersDash extends Component {
  state = {
    operationkey: 'cluster0',
    loading:true,
  };
  componentWillReceiveProps(nextProps){
    if(nextProps.clusterData.length > 0){
      this.setState({loading:false});
    }
  }
  renderTabContent=(cluster)=>{
    //console.log('clusterData',cluster);
    let appsCount = 0;
    let middlewaresCount = 0;
    cluster.containInfos.forEach(element=>{
      if(element.nodeDetail && element.nodeDetail.apps){
        appsCount += element.nodeDetail.apps.length;
      }
    });
    const columns = [{ 
        title: '主机', dataIndex: 'nodeName', width:'20%'
      },{ 
        title: '状态', dataIndex: 'status', width:'10%',
        render: (text, record) => {
          return <Badge status={statusMap[text]} text={status[text]} />;
        }
      },{ 
        title: 'Docker版本', dataIndex: 'dockerVersion', width:'10%'
      },{ 
        title: 'CPU', dataIndex: 'totalCPU', width:'10%'
      },{ 
        title: 'CPU使用率', dataIndex: 'cpu', width:'20%',
        render:(value,record)=>{
          value = parseInt(value,10);
          if(value < constants.PROGRESS_STATUS[0]){
            return <Progress percent={value} status='normal' className='normal' />
          }else if(value >=  constants.PROGRESS_STATUS[0] && value < constants.PROGRESS_STATUS[1]){
            return <Progress percent={value} status='normal' className='warning' />
          }else{
            return <Progress percent={value} status='normal' className='danger' />
          }
        }
      },{ 
        title: '内存', dataIndex: 'totalMemory', width:'10%'
      },{ 
        title: '内存使用率', dataIndex: 'memory', width:'20%',
        render:(value,record)=>{
          value = parseInt(value,10);
          if(value < constants.PROGRESS_STATUS[0]){
            return <Progress percent={value} status='normal' className='normal' />
          }else if(value >=  constants.PROGRESS_STATUS[0] && value < constants.PROGRESS_STATUS[1]){
            return <Progress percent={value} status='normal' className='warning' />
          }else{
            return <Progress percent={value} status='normal' className='danger' />
          }
        }
      }];
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
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
              title={<Fragment><span style={{marginRight:16}}>CPU总量</span><Tooltip title="当前集群各主机CPU核数总和"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={parseInt(cluster.cpuTotal,10)/1000+'核'}
              contentHeight={46}/>
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
              title={<Fragment><span style={{marginRight:16}}>内存总量</span><Tooltip title="当前集群内各主机内存总和"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={(parseInt(cluster.memoryTotal,10)/1024/1024/1024).toFixed(0)+'GB'}
              contentHeight={46}/>
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
              title={<Fragment><span style={{marginRight:16}}>应用</span><Tooltip title="当前集群所运行的业务应用数量"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={appsCount/* cluster.appCount */ }
              contentHeight={46}/>
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
              title={<Fragment><span style={{marginRight:16}}>中间件</span><Tooltip title="当前集群所运行的中间件数量"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={middlewaresCount/* cluster.middlewareCount */ }
              contentHeight={46}/>
          </Col>
        </Row>
        <Table
          size={'middle'}
          columns={columns}
          pagination={false}
          expandedRowRender={
            record =>{
              if(record.nodeDetail){
                return( 
                  <Fragment>
                    { record.nodeDetail.k8scontainers &&
                    <Row>
                      { 
                        record.nodeDetail.k8scontainers.map((element,index)=>{
                          let status = 'success';
                          let title = (
                            <p key={index}>
                              <span>CPU限值：{element.cpuTotal?element.cpuTotal/1000+'核':'未限定'}</span><br/>
                              <span>内存限值：{element.memoryTotal?(element.memoryTotal/1024/1024/1024).toFixed(0)+'GB':'未限定'}</span><br/>
                              <span>CPU使用率：{element.cpu}%</span><br/>
                              <span>内存使用率：{element.memory}%</span><br/>
                            </p>
                          )
                          if((element.cpu >= constants.PROGRESS_STATUS[0] 
                            && element.cpu < constants.PROGRESS_STATUS[1]) 
                            || (element.memory >= constants.PROGRESS_STATUS[0] 
                            && element.memory < constants.PROGRESS_STATUS[1]) ){
                              status = 'warning';
                          }else if(element.cpu > constants.PROGRESS_STATUS[1]
                            || element.memory > constants.PROGRESS_STATUS[1]){
                              status = 'error';
                          }
                          return (
                            <Col key={index} span={6}>
                              <Badge status={status} />
                              <Tooltip title={title}>
                                <span style={{marginRight:48}}>{element.name}</span>
                              </Tooltip>
                            </Col>
                          )
                        })
                      }
                    </Row>
                    }
                    <Divider style={{ marginBottom:8,marginTop:8 }} />
                    { record.nodeDetail.apps &&
                    <Row>
                      {
                        record.nodeDetail.apps.map((element,index)=>{
                          let status = 'success';
                          element.containers.forEach(item=>{
                            if( status !== 'error' &&
                              ((item.cpu >= constants.PROGRESS_STATUS[0] 
                              && item.cpu < constants.PROGRESS_STATUS[1]) 
                              || (item.memory >= constants.PROGRESS_STATUS[0] 
                              && item.memory < constants.PROGRESS_STATUS[1]) )
                            ){
                                status = 'warning';
                            }else if(item.cpu > constants.PROGRESS_STATUS[1]
                              || item.memory > constants.PROGRESS_STATUS[1]){
                                status = 'error';
                            }
                          })
                          let title = (
                            <p>
                              { element.containers.map((item,index)=>{
                                return(
                                  <span key={index} >实例{index+1}：<br/>
                                    <span style={{marginLeft:24}}>CPU限值：{item.cpuTotal?item.cpuTotal/1000+'核':'未限定'}</span><br/>
                                    <span style={{marginLeft:24}}>内存限值：{item.memoryTotal?(item.memoryTotal/1024/1024/1024).toFixed(0)+'GB':'未限定'}</span><br/>
                                    <span style={{marginLeft:24}}>CPU使用率：{item.cpu}%</span><br/>
                                    <span style={{marginLeft:24}}>内存使用率：{item.memory}%</span><br/>
                                  </span>
                                )
                              })
                              }
                            </p>
                          )
                          return (
                            <Col key={index} span={6}>
                              <Badge status={status} />
                              <Tooltip title={title}>
                                <span style={{marginRight:48}}>{element.appName}</span>
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
          } 
          dataSource={cluster.containInfos}
        />
      </Fragment>
    )
  }
  render() {
    let contentList = {};
    let operationTabList = [];
    this.props.clusterData.forEach((cluster,index) => {
      operationTabList.push({key:'cluster'+index,tab:cluster.name});
      contentList['cluster'+index]=this.renderTabContent(cluster);
    });
    return (
        <Card
          loading={this.state.loading}
          style={{ width: '100%' }}
          tabList={operationTabList}
          activeTabKey={this.state.operationkey}
          onTabChange={(key) => this.setState({operationkey:key})}>
          {contentList[this.state.operationkey]}
        </Card>
    );
  }
}