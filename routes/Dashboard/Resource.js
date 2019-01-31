import React from 'react'
import { Row, Col, Icon, Tooltip, Spin, Card } from 'antd';
import { ChartCard, Field, MiniBar } from 'ant-design-pro/lib/Charts';
import PageHeaderBreadcrumb from '../../common/PageHeaderBreadcrumb';
import Clusters from '../../components/Dashboard/Clusters';
import moment from 'moment';
import { appOnlineNum,appHighestOnlineNum,appVisitNum } from '../../services/monit'
import { formateValue } from '../../utils/utils'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import constants from "../../services/constants";
import { base } from '../../services/base';
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'

class ResourceDashboard extends React.Component {
  state = {
    clusterData: [],
    pvData: [],
    uvData: [],
    pvTotal: 0,
    uvTotal: 0,
    pvToday: 0,
    uvToday: 0,
    successNode: 0,
    warningNode: 0,
    errorNode: 0,
    successApp: 0,
    warningApp: 0,
    errorApp: 0,
    clusterTotal: 0,
    appTotal: 0,
    hostLoading: false,
    pvLoading: false,   //访问量loading状态
    uvLoading: false,   //用户loading状态
    hostStatus:true,
    pvStatus:true,
    uvStatus:true
  }

  originState = () => {
    this.setState({
      pvTotal: '',
      pvToday: '',
      pvData: '',
      uvTotal: '',
      uvToday: '',
      uvData: ''
    })
  }
  componentDidMount() {
    this.loadDatas();
    this.setState({ hostLoading: true });
  }
  loadDatas = () => {
    // this.originState();
    // this.setState({ pvLoading: true, uvLoading: true })
    // let st = moment().subtract(7, 'day').format('x');
    // let et = moment().add(1, 'day').format('x');
    // appPvUv({ startTime: st, endTime: et }).then(data => {
    //   let tempData = [];
    //   for (let i = 7; i >= 0; i--) {
    //     tempData.push({
    //       date: moment().subtract(i, 'day').format('YYYY-MM-DD'),
    //       pv: 0,
    //       uv: 0
    //     })
    //   }
    //   let uvData = [];
    //   let pvData = [];
    //   let pvToday = 0;
    //   let uvToday = 0;
    //   let pvTotal = 0;
    //   let uvTotal = 0;
    //   data.forEach(element => {
    //     element.pv = element.pv ? element.pv : 0;
    //     element.uv = element.uv ? element.uv : 0;
    //     tempData.forEach(item => {
    //       if (moment(element.date).format('YYYY-MM-DD') === item.date) {
    //         item.pv = element.pv;
    //         item.uv = element.uv;
    //       }
    //       uvData.push({
    //         x: item.date,
    //         y: parseInt(item.uv, 10)
    //       })
    //       pvData.push({
    //         x: item.date,
    //         y: parseInt(item.pv, 10)
    //       })
    //     })
    //     pvTotal += parseInt(element.pv, 10);
    //     uvTotal += parseInt(element.uv, 10);
    //   })
    //   if (data.length > 0) {
    //     pvToday = tempData[tempData.length - 1].pv;
    //     uvToday = tempData[tempData.length - 1].uv;
    //   }
    //   this.setState({ pvData, uvData, pvTotal, uvTotal, pvToday, uvToday, pvLoading: false, uvLoading: false,pvStatus:true,uvStatus:true });
    // }).catch(() => {
    //   this.setState({ pvData: null, uvData: null, pvTotal: null, uvTotal: null, pvToday: null, uvToday: null, pvLoading: false, uvLoading: false,pvStatus:false,uvStatus:false })
    // });
    appHighestOnlineNum().then(high=>{
      if(high){
        this.setState({uvToday:high});
      }
    }).catch(err=>{
      this.setState({uvStatus:false})
    });
    appOnlineNum().then(num=>{
      if(num){
        this.setState({uvTotal:num});
      }
    }).catch(err=>{
      this.setState({uvStatus:false})
    });

    //let totalSt = moment().year(2019).month(1).day(1).hour(0).minute(0).seconds(0).valueOf();
    let et =  moment().valueOf();
    appVisitNum().then(visit=>{
      this.setState({
        pvTotal:visit
      })
    }).catch(err=>{
      this.setState({pvStatus:false})
    });

    let st = moment().hour(0).minute(0).seconds(0).valueOf();
    
    appVisitNum({st:st,et:et}).then(visit=>{
      this.setState({
        pvToday:visit
      })
    }).catch(err=>{
      this.setState({pvStatus:false})
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.environment !== this.props.environment) {
      this.loadDatas();
    }
  }
  //通过clusters子组件获取主机和应用信息
  onHostAndAppInfo = (data,status) => {
    this.setState({
      ...data,
      hostLoading: false,
      hostStatus:status
    });
  }
  renderHost = () => {
    const { successNode, warningNode, errorNode, clusterTotal } = this.state;
    return (
      <ChartCard
        title="主机状态"
        action={this.state.hostStatus?<Tooltip title="当前租户可使用集群数量及主机状态统计"><Icon type="info-circle-o" /></Tooltip>
                                      :<Tooltip title="获取租户集群信息出错！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        footer={<Field label="集群总数" value={formateValue(clusterTotal)} />}
        contentHeight={88}
      >
        <div style={{ top: -70, position: 'absolute', width: '100%', textAlign: 'center' }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.normal }}>正常</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.warn }}>警告</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.error }}>严重</span></Col>
          </Row>
          <Row>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.normal }}>{formateValue(successNode)}</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.warn }}>{formateValue(warningNode)}</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.error }}>{formateValue(errorNode)}</span></Col>
          </Row>
        </div>
      </ChartCard>
    )
  }
  renderApp = () => {
    const { appTotal, successApp, warningApp, errorApp } = this.state;
    return (
      <ChartCard
        title="应用状态"
        action={this.state.hostStatus?<Tooltip title="当前租户在当前环境中的应用总数及状态"><Icon type="info-circle-o" /></Tooltip>
                                       :<Tooltip title="获取集群信息失败！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn}/></Tooltip>}
        footer={<Field label="应用总数" value={formateValue(appTotal)} />}
        contentHeight={88}
      >
        <div style={{ top: -70, position: 'absolute', width: '100%', textAlign: 'center' }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.normal }}>正常</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.warn }}>警告</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.error }}>严重</span></Col>
          </Row>
          <Row>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.normal }}>{formateValue(successApp)}</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.warn }}>{formateValue(warningApp)}</span></Col>
            <Col span={8}><span style={{ color: constants.WARN_COLOR.error }}>{formateValue(errorApp)}</span></Col>
          </Row>
        </div>
      </ChartCard>
    )
  }

  renderPvTotal = () => {
    const { pvTotal, pvToday, pvData } = this.state;
    return (
      <ChartCard
        title="访问量"
        total={formateValue(pvTotal)}
        action={this.state.pvStatus?<Tooltip title="2019年一月一日至今访问总量"><Icon type="info-circle-o" /></Tooltip>
                                    :<Tooltip title="获取访问量失败！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn} /></Tooltip>}
        footer={
          <div>
            <Field label="当日访问量" value={formateValue(pvToday)} />
          </div>}
        contentHeight={46}
      >
        {/* <MiniArea height={46} color="#975FE4" data={formateValue(pvData)} /> */}
        <MiniBar
          height={46} data={formateValue(pvData)}
        />
      </ChartCard>
    )
  }

  renderUvTotal = () => {
    const { uvTotal, uvToday, uvData } = this.state;
    return (
      <ChartCard
        title="在线人数"
        total={formateValue(uvTotal)}
        action={this.state.uvStatus?<Tooltip title="当前在线人数"><Icon type="info-circle-o" /></Tooltip>
                                      :<Tooltip title="获取在线人数失败！"><Icon type="info-circle-o" theme="twoTone" twoToneColor={constants.WARN_COLOR.warn} /></Tooltip>}
        footer={
          <div>
            <Field label="最高在线人数" value={formateValue(uvToday)} />
          </div>}
        contentHeight={46}
      >
        <MiniBar
          height={46} data={formateValue(uvData)}
        />
      </ChartCard>
    )
  }
  render() {
    const {
      hostLoading, pvLoading, uvLoading
    } = this.state;
    const topColResponsiveProps = { xs: 24, sm: 12, md: 12, lg: 12, xl: 6, style: { marginBottom: 24 } };
    return (
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeaderBreadcrumb breadcrumbList={[{name:'Dashboard'},{name:'资源监控'}]} action={<GlobalEnvironmentChange/>}/>
        <div style={{ margin: '24px 24px 0' }}>
          <Row gutter={24}>
            <Col {...topColResponsiveProps}>
              {hostLoading ?
                <Spin >
                  {this.renderHost()}
                </Spin> : this.renderHost()
              }
            </Col>
            <Col {...topColResponsiveProps}>
              {hostLoading ?
                <Spin >
                  {this.renderApp()}
                </Spin> : this.renderApp()
              }
            </Col>
            <Col {...topColResponsiveProps}>
              {pvLoading ?
                <Spin>
                  {this.renderPvTotal()}
                </Spin> : this.renderPvTotal()
              }
            </Col>
            <Col {...topColResponsiveProps}>
              {uvLoading ?
                <Spin>
                  {this.renderUvTotal()}
                </Spin> : this.renderUvTotal()}
            </Col>
          </Row>
          <Clusters isTenant={true} onHostAndAppInfo={this.onHostAndAppInfo} tenant={this.props.tenant}/>

          <Card style={{ marginTop: 24,}} bodyStyle={{padding:0}} title='资源监控'>
            <iframe title='资源监控' style={{border:0,height:'2550px',width:'100%'}} src={base.configs.globalResourceMonitUrl+constants.GRAFANA_URL.tenant+"&var-tenant="+this.props.tenant}></iframe>
          </Card>
        </div>
      </div>
    );
  }
}

export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <ResourceDashboard tenant={context.tenant} environment={context.environment} />}
  </GlobalHeaderContext.Consumer>
);
