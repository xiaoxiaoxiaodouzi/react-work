import React from 'react'
import { Row, Col, Icon, Tooltip, Spin,Divider,Breadcrumb } from 'antd';
import { ChartCard, Field, MiniBar, MiniArea } from 'ant-design-pro/lib/Charts';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import Clusters from '../../components/Dashboard/Clusters';
import moment from 'moment';
import { appPvUv } from '../../services/monitor'
import { formateValue } from '../../utils/utils'
import GlobalEnvironmentChange from '../../components/GlobalEnvironmentChange';
import constants from "../../services/constants";

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
    this.originState();
    this.setState({ pvLoading: true, uvLoading: true })
    let st = moment().subtract(7, 'day').format('x');
    let et = moment().add(1, 'day').format('x');
    appPvUv({ startTime: st, endTime: et }).then(data => {
      let tempData = [];
      for (let i = 7; i >= 0; i--) {
        tempData.push({
          date: moment().subtract(i, 'day').format('YYYY-MM-DD'),
          pv: 0,
          uv: 0
        })
      }
      let uvData = [];
      let pvData = [];
      let pvToday = 0;
      let uvToday = 0;
      let pvTotal = 0;
      let uvTotal = 0;
      data.forEach(element => {
        element.pv = element.pv ? element.pv : 0;
        element.uv = element.uv ? element.uv : 0;
        tempData.forEach(item => {
          if (moment(element.date).format('YYYY-MM-DD') === item.date) {
            item.pv = element.pv;
            item.uv = element.uv;
          }
          uvData.push({
            x: item.date,
            y: parseInt(item.uv, 10)
          })
          pvData.push({
            x: item.date,
            y: parseInt(item.pv, 10)
          })
        })
        pvTotal += parseInt(element.pv, 10);
        uvTotal += parseInt(element.uv, 10);
      })
      if (data.length > 0) {
        pvToday = tempData[tempData.length - 1].pv;
        uvToday = tempData[tempData.length - 1].uv;
      }
      this.setState({ pvData, uvData, pvTotal, uvTotal, pvToday, uvToday, pvLoading: false, uvLoading: false });
    }).catch(() => {
      this.setState({ pvData: null, uvData: null, pvTotal: null, uvTotal: null, pvToday: null, uvToday: null, pvLoading: false, uvLoading: false })
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      this.loadDatas();
    }
  }
  //通过clusters子组件获取主机和应用信息
  onHostAndAppInfo = (data) => {
    this.setState({
      ...data,
      hostLoading: false
    });
  }
  renderHost = () => {
    const { successNode, warningNode, errorNode, clusterTotal } = this.state;
    return (
      <ChartCard
        title="主机状态"
        action={<Tooltip title="当前租户可使用集群数量及主机状态统计"><Icon type="info-circle-o" /></Tooltip>}
        footer={<Field label="集群总数" value={formateValue(clusterTotal)} />}
        contentHeight={88}
      >
        <div style={{ top: -70, position: 'absolute', width: '100%', textAlign: 'center' }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={8}><span style={{color:constants.WARN_COLOR.normal}}>正常</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.warn}}>警告</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.error}}>严重</span></Col>
          </Row>
          <Row>
            <Col span={8}><span style={{color:constants.WARN_COLOR.normal}}>{formateValue(successNode)}</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.warn}}>{formateValue(warningNode)}</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.error}}>{formateValue(errorNode)}</span></Col>
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
        action={<Tooltip title="当前租户在当前环境中的应用总数及状态"><Icon type="info-circle-o" /></Tooltip>}
        footer={<Field label="应用总数" value={formateValue(appTotal)} />}
        contentHeight={88}
      >
        <div style={{ top: -70, position: 'absolute', width: '100%', textAlign: 'center' }}>
          <Row style={{ marginBottom: 8 }}>
            <Col span={8}><span style={{color:constants.WARN_COLOR.normal}}>正常</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.warn}}>警告</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.error}}>严重</span></Col>
          </Row>
          <Row>
            <Col span={8}><span style={{color:constants.WARN_COLOR.normal}}>{formateValue(successApp)}</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.warn}}>{formateValue(warningApp)}</span></Col>
            <Col span={8}><span style={{color:constants.WARN_COLOR.error}}>{formateValue(errorApp)}</span></Col>
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
        action={<Tooltip title="当前租户在当前环境中的所有应用最近一周内页面访问总量"><Icon type="info-circle-o" /></Tooltip>}
        footer={
          <div>
            <Field label="当日访问量" value={formateValue(pvToday)} />
          </div>}
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={formateValue(pvData)} />
      </ChartCard>
    )
  }

  renderUvTotal = () => {
    const { uvTotal, uvToday, uvData } = this.state;
    return (
      <ChartCard
        title="用户数"
        total={formateValue(uvTotal)}
        action={<Tooltip title="当前租户在当前环境中的所有应用最近一周内访问凭证创建总数"><Icon type="info-circle-o" /></Tooltip>}
        footer={
          <div>
            <Field label="当日访问人数" value={formateValue(uvToday)} />
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

    let breadcrumTitle = <Breadcrumb style={{marginTop:6}}>
      <Breadcrumb.Item><Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> Dashboard</Breadcrumb.Item>
      <Breadcrumb.Item>资源监控</Breadcrumb.Item>
    </Breadcrumb>;
    return (
      <div style={{ margin: '-24px -24px 0 -24px' }}>
        <PageHeader
          title={breadcrumTitle}
          action={<GlobalEnvironmentChange/>}          
          />
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
          <Clusters isTenant={true} onHostAndAppInfo={this.onHostAndAppInfo} />
        </div>
      </div>
    );
  }
}

export default ResourceDashboard;