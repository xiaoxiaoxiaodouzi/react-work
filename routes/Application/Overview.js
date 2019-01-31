import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Tooltip } from 'antd';
import RunningResource from '../../components/Application/Overview/RunningResource';
// import numeral from 'numeral';
import moment from 'moment';
import { serviceavgtime, serviceerrornum, resourceusage, visitnum, onlinenum, highestonlinenum } from '../../services/monit';
import { getApp} from '../../services/aip'
import './Overview.less';
import {base} from '../../services/base'
import constants from '../../services/constants'
import {formateValue} from '../../utils/utils'
import DataFormate from '../../utils/DataFormate'
import { ErrorComponentCatch } from '../../common/SimpleComponents';

/* 应用概览页面，使用图表组件显示应用相关信息*/
class AppOverview extends React.PureComponent {
  state = {
    errCount:'--',
    avgTime:'--',
    resourceStatus:'health',
    APMChecked:false,   //APM是否开启
    pvData:'--', 
    uvData:'--', 
    todayPVTotal:'--', 
    todayUVTotal:'--'
  };
  componentDidMount(){
    //获取全局动态路由配置
      const appid = this.props.appId;
      getApp(appid).then(data=>{
        if(data){
          this.setState({
            APM_URL: base.configs[constants.CONFIG_KEY.APM_URL],
            APMChecked:base.configs[constants.CONFIG_KEY.APM_URL]?data.apm:false,
            updateTime: moment(data.updatetime).format('YYYY-MM-DD'),
            runningTime:DataFormate.periodFormate(data.updatetime)
          })
          this.loadData(data);
        }
      })
  }

  loadData=(appData)=>{
    const appid = appData.id;
    if(base.currentEnvironment.serviceMonitorSwitch && base.configs.passEnabled){
      //健康状态
      resourceusage(appid).then(data=>{
        if(data.cpu > 75 || data.memory > 75 || data.filesystem > 75){
          this.setState({resourceStatus:'lack'})
        }else{
          this.setState({resourceStatus:'health'})
        }
      })
      //服务平均响应
      serviceavgtime(appid).then(data=>{
        this.setState({avgTime: parseInt(data,10)})
      })
      //服务报错次数
      serviceerrornum(appid).then(data=>{
        this.setState({errCount: parseInt(data,10)})
      })
      //访问量
      visitnum(appid,{st:moment(appData.createtime).format('x'),et:moment().format('x')}).then(data=>{
        this.setState({totalPV: parseInt(data,10)})
      })
      //单天的访问量数据
      const st = moment().set({hour: 0, minute:0, second: 0}).format('x');
      const et = moment().format('x');
      visitnum(appid,{st,et}).then(data=>{
        this.setState({todayPVTotal: parseInt(data,10)})
      })
      //在线人数
      onlinenum(appid).then(data=>{
        this.setState({totalUV: parseInt(data,10)})
      })
      //当日在线人数
      highestonlinenum(appid).then(data=>{
        this.setState({todayUVTotal: parseInt(data,10)})
      })
    }
    
  }
  render(){
    const { errCount, resourceStatus, avgTime, pvData, uvData, todayPVTotal, todayUVTotal} = this.state;
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <Row gutter={24} style={{margin:"24px 12px 0px 12px"}}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="健康状况"
              action={<Tooltip title="最近一周内应用及所提供服务的运行状况"><Icon type="info-circle-o" /></Tooltip>}
              total={
                resourceStatus === 'health'?
                <span style={{fontSize:28,color:"green"}}>健康</span> :
                <span style={{fontSize:28,color:"orange"}}>资源紧张</span>
              }
              footer={
                <div>
                  <Field label="资源使用情况" value={
                    resourceStatus === 'health'?
                    <span style={{marginLeft:0,color:'green'}}>正常</span> :
                    <span style={{marginLeft:0,color:'orange'}}>资源紧张</span>
                  }/>
                  <Field label="服务平均响应" value={formateValue(avgTime)+'ms'}/>
                  <Field label="服务报错次数" value={formateValue(errCount)}/>
                </div>} >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="访问量"
              action={<Tooltip title="域名访问方式下的应用页面访问总量"><Icon type="info-circle-o" /></Tooltip>}
              total={formateValue(this.state.totalPV) }
              footer={<Field label="当日访问量" value={formateValue(todayPVTotal)} />}
              contentHeight={52}
            >
              <MiniArea color="#975FE4" data={formateValue(pvData)} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="在线人数"
              action={<Tooltip title="域名访问方式下的应用凭证创建总数"><Icon type="info-circle-o" /></Tooltip>}
              total={formateValue(this.state.totalUV)}
              footer={<Field label="当日在线人数" value={todayUVTotal} />}
              contentHeight={52}
            >
              <MiniBar
                height={52}
                data={uvData}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="持续运行时长"
              total={formateValue(this.state.runningTime) }
              footer={
                <div>
                  <Field label="最近变更时间" value={formateValue(this.state.updateTime)}/>
                </div>}
              contentHeight={52}
            >
              <MiniBar
                height={52}
              />
            </ChartCard>
          </Col>
        </Row>
        {base.configs.monitEnabled || base.configs.APMEnabled ?<RunningResource appId={this.props.appId} appCode={this.props.appCode} history={this.props.history} APM_URL={this.state.APM_URL} APMChecked={this.state.APMChecked} deployMode={this.props.deployMode}/> :""}
      </Fragment>
    )
  }
}

export default ErrorComponentCatch(AppOverview);
