import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Tooltip } from 'antd';
import RunningResource from '../../components/Application/Overview/RunningResource';
import numeral from 'numeral';
import moment from 'moment';
import { getAppmonit, getAvgTime, getApppvoruv} from '../../services/dashApi'
import { getApp} from '../../services/running'
import './Overview.less';
import {base} from '../../services/base'
import constants from '../../services/constants'
import {  getupstream } from '../../services/domainList'
import {formateValue} from '../../utils/utils'
import DataFormate from '../../utils/DataFormate'

const currentTime = moment(new Date()).format('x');
const lastWeek = moment(new Date(new Date() - 7*24 * 60 * 60 * 1000)).format('x')
/* 应用概览页面，使用图表组件显示应用相关信息*/
export default class AppOverview extends React.PureComponent {
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
          let ups = data.upstream ? data.upstream.split('//') : '';
          let upstream='';
          if (ups.length > 1) {
            upstream = ups[1]
          } else {
            upstream = ups[0]
          }
          //判断有没有配置域名 没有的 话 则不显示PV UV数据
          getupstream(upstream).then(datas=>{
            if(datas){
              //获取应用资源使用情况
              this.loadData(appid);
            }
          })
          //existEnvs()
          this.setState({
            APM_URL: base.configs[constants.CONFIG_KEY.APM_URL],
            APMChecked:base.configs[constants.CONFIG_KEY.APM_URL]?data.apm:false,
            updateTime: moment(data.updatetime).format('YYYY-MM-DD'),
            runningTime:DataFormate.periodFormate(data.updatetime)
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
    getAppmonit(appid).then(data=>{
      if(data.cpu > 75 || data.memory > 75 || data.filesystem > 75){
        this.setState({resourceStatus:'lack'})
      }else{
        this.setState({resourceStatus:'health'})
      }
    })
    getAvgTime(appid).then(data=>{
      if (data.avgTime){
        this.setState({
          avgTime: formateValue(data.avgTime)
        })
      }
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
          pvData:formateValue(pvData) ,
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
          uvData: formateValue(uvData),
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
        todayPVTotal: formateValue(numeral(data.total).format('0,0'))
      })
    })
    getApppvoruv(queUV).then(data => {
      this.setState({
        todayUVTotal:formateValue(numeral(data.total).format('0,0'))
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
                  <Field label="服务平均响应" value={formateValue(avgTime)}/>
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
              footer={<Field label="当日在线人数" value={formateValue(todayUVTotal)} />}
              contentHeight={52}
            >
              <MiniBar
                height={52}
                data={formateValue(uvData)}
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
        <RunningResource appId={this.props.appId} appCode={this.props.appCode} history={this.props.history} APM_URL={this.state.APM_URL} APMChecked={this.state.APMChecked} deployMode={this.props.deployMode}/>
      </Fragment>
    )
  }
}
