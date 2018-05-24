import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Tooltip } from 'antd';
import RunningResource from '../../components/Application/Overview/RunningResource';
import numeral from 'numeral';
import moment from 'moment';
import { getAppmonit, getAvgTime, getErrCount, getApppvoruv} from '../../services/dashApi'
import { getApp} from '../../services/running'
import './Overview.less';
import {base} from '../../services/base'
import constants from '../../services/constants'
import { getConfigs} from '../../services/setting'
import { queryBaseConfig, queryEnvs} from '../../services/deploy'
import {  getupstream } from '../../services/domainList'


const currentTime = moment(new Date()).format('x');
const lastWeek = moment(new Date(new Date() - 7*24 * 60 * 60 * 1000)).format('x')
/* 应用概览页面，使用图表组件显示应用相关信息*/
export default class AppOverview extends React.PureComponent {
  state = {
    errCount:0,
    avgTime:0,
    resourceStatus:'health',
    APMChecked:false,   //APM是否开启
  };
  componentDidMount(){
    let code = this.props.appCode;
    const env = base.currentEnvironment;
    const configs = env.code + '_' + code;
    this.setState({
      config: configs
    })
    //获取全局动态路由配置
    getConfigs().then(data1 => {
      //将APM_URL地址
      this.setState({
        APM_URL: data1[constants.CONFIG_KEY.APM_URL],
      })
    })
    const appid = this.props.appId;
    getApp(appid).then(data=>{
      if(data){
        let ups = data.upstream ? data.upstream.split('//') : '';
        let upstream='';
        if (ups.length > 1) {
          upstream = upstream[1]
        } else {
          upstream = upstream[0]
        }
        //判断有没有配置域名 没有的 话 则不显示PV UV数据
        getupstream(upstream).then(datas=>{
          if(datas){
            //获取应用资源使用情况
            this.loadData(appid);
          }
        })
        let rTime=parseInt((new Date().getTime() - data.updatetime) / 1000 / 60 / 60,10);
        let r='';
        if(rTime<24){
          r='小时'
        }
        if (rTime===24 || 24<rTime<1440){
          rTime = parseInt(rTime/24,10);
          r='天'
        }
          if (rTime === 1440 || (1440 < rTime && rTime<17280)){
          rTime = parseInt(rTime / 24/60,10);
          r='个月'
        }
        if (rTime===17280 ||17280 < rTime) {
          rTime = parseInt(rTime / 24 / 60/12,10);
          r = '年'
        }
        this.setState({
          APMChecked:data.apm,
          updateTime: moment(data.updatetime).format('YYYY-MM-DD'),
          runningTime: rTime+r
        })
      }
    })
  }

  loadData=(appid)=>{
    let quePV={
      startTime: lastWeek,
      endTime: currentTime,
      apikeyId: appid,
      type:'PV',
      interval:'1h'
    }
    let queUV={
      startTime: lastWeek,
      endTime: currentTime,
      apikeyId: appid,
      type: 'UV',
      interval:'1d'
    }
    let queryParam={
      startTime: lastWeek,
      apikeyId:appid,
    }
    getAppmonit(appid).then(data=>{
      console.log('appinfo',data);
      if(data.cpu > 75 || data.memory > 75 || data.filesystem > 75){
        this.setState({resourceStatus:'lack'})
      }else{
        this.setState({resourceStatus:'health'})
      }
    })
    getAvgTime(appid).then(data=>{
      if (data.avgTime){
        this.setState({
          avgTime: data.avgTime
        })
      }
    })
    getErrCount(queryParam).then(data=>{

    })
    getApppvoruv(quePV).then(data=>{
      if(data && data.result && data.result.list){
        const pvData = [];
        data.result.list.forEach(item=>{
          pvData.push({
            x: moment(item.time).format('YYYY-MM-DD: HH'),
            y: parseInt(item.count,10),
          })
        })
        this.setState({
          pvData: pvData,
          totalPV: numeral(data.total).format('0,0')
        })
      }
    })
    getApppvoruv(queUV).then(data=>{
      if (data && data.result && data.result.list) {
        const uvData = [];
        data.result.list.forEach(item => {
          uvData.push({
            x: moment(item.time).format('YYYY-MM-DD'),
            y: parseInt(item.count,10),
          })
        })
        this.setState({
          uvData: uvData,
          totalUV: numeral(data.total).format('0,0')
        })
      }
    })
    //然后分别查单天的数据
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    quePV.startTime = moment(today).format('x') ;
    queUV.startTime = moment(today).format('x');
    getApppvoruv(quePV).then(data => {
      this.setState({
        todayPVTotal: numeral(data.total).format('0,0')
      })
    })
    getApppvoruv(queUV).then(data => {
      this.setState({
        todayUVTotal: numeral(data.total).format('0,0')
      })
    })
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
                  <Field label="服务平均响应" value={avgTime}/>
                  <Field label="服务报错次数" value={errCount}/>
                </div>} >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="访问量"
              action={<Tooltip title="域名访问方式下的应用页面访问总量"><Icon type="info-circle-o" /></Tooltip>}
              total={this.state.totalPV ? this.state.totalPV:'无数据'}
              footer={<Field label="当日访问量" value={todayPVTotal ?todayPVTotal:0} />}
              contentHeight={52}
            >
              <MiniArea color="#975FE4" data={pvData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="访问人数"
              action={<Tooltip title="域名访问方式下的应用凭证创建总数"><Icon type="info-circle-o" /></Tooltip>}
              total={this.state.totalUV ? this.state.totalUV:'无数据'}
              footer={<Field label="当日访问人数" value={todayUVTotal?todayUVTotal:0} />}
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
              total={this.state.runningTime ? this.state.runningTime:0}
              footer={
                <div>
                  <Field label="最近变更时间" value={this.state.updateTime}/>
                </div>}
              contentHeight={52}
            >
              <MiniBar
                height={52}
              />
            </ChartCard>
          </Col>
        </Row>
        <RunningResource appId={this.props.appId} appCode={this.props.appCode} history={this.props.history} APMChecked={this.state.APMChecked}/>
      </Fragment>
    )
  }
}
