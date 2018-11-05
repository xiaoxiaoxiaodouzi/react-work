import React,{Fragment} from 'react'
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import { getServiceavgtimes } from '../../services/monitor'
import {getApp} from '../../services/dashApi';
import LoadingComponent from '../../common/LoadingComponent';
import moment from 'moment';
import {base} from '../../services/base'
import { DataSet } from '@antv/data-set';
import { message} from 'antd';

export default class SlowServices extends React.Component{
  state={
    data:[],
    loading:false,
    dv:[],
  }
  componentDidMount(){
    this.loadDatas();
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps!==this.props){
      this.loadDatas();
    }
  }

  loadDatas=()=>{
    this.setState({loading:true})
    let st = moment().subtract(1,'month').format('x');
    let et = moment().format('x');
    if(base.currentEnvironment.serviceMonitorSwitch){
      getServiceavgtimes({startTime:st,endTime:et,tenant:base.tenant}).then(data=>{
        let datas=[];
        this.setState({loading:false})
        if(data){
          data.forEach(item=>{
            let params={
              time:item.avgTime,
              serviceName:item.service.name+': '+item.service.methods+' '+item.service.uri,
              service:item.service
            }
            /* if(names.indexOf(item.service.name)===-1){
              names.push(item.service.name)
            }else{
              for(var i=0;i<data.length;i++){
                if(names.indexOf(item.service.name+`(${i})`)===-1){
                  names.push(item.service.name+`(${i})`);
                  break;
                }
             }
            }  */
            datas.push(params)
          })
        }
        const ds = new DataSet();
        const dv = ds.createView().source(datas);
        dv.source(datas).transform({
            type: 'sort',
            callback(a, b) { // 排序依据，和原生js的排序callback一致
              return a.time - b.time > 0;
            }
        }); 
        this.setState({
          data:dv,
          dv:datas
        })
      }).catch(err=>{
        message.error('获取服务平均响应时间统计出错')
        this.setState({
          loading:false,
          data:[],
          dv:[]
        })
      })
    }
  }

  handleClick=(e)=>{
    if(e.data){
      let id=e.data._origin.service.id;
      let appId=e.data._origin.service.groupId;
      getApp(appId).then(data=>{
        if(data){
          const history=this.props.history;
          history.push({pathname:'/apis/'+id})
        }
      }).catch(err=>{
        message.error('当前环境下不存在该应用')
      })
    }
  }
  render(){
    const scale = {
      time: {
        alias:'时间(ms)',
        type: "linear",
        tickCount: 10,
      }
    };
    const label = {
      formatter(text, item, index) {
        let t=text.split(':')[0]
        if (t.length > 20) { 
          return t.substring(0, 10) + "..."; 
        }else{ 
          return t; 
        }
      },
    }
    const tickLine = {
      lineWidth: 1, // 刻度线宽
      stroke: '#ccc', // 刻度线的颜色
      length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
    }
    const chart = (
      <Chart 
        onPlotClick={this.handleClick}
        height={400}  scale={scale}
        padding={[ 0, 30, 80, 220]} 
        data={this.state.data} forceFit >
        <Coord transpose />
        <Axis name="serviceName" label={label} tickLine={tickLine}/>
        <Axis name="time" title />
        <Tooltip />
        <Geom type="interval" position="serviceName*time*uri" size={15} tooltip={['serviceName*time*uri', (serviceName, time) => {
        return {
          //自定义 tooltip 上显示的 title 显示内容等。
          name:'时间',
          value:time+'ms',
        };
        }]}/>
      </Chart>
    )
    return (
      <Fragment>
        <LoadingComponent 
          loadingText='响应最慢事务数据'
          loading={this.state.loading} 
          exceptionText='没有加载到服务平均响应时间的数据'
          exception={ this.state.dv.length >0 ? false : true } >
          {chart}
        </LoadingComponent> 
        {/* this.state.loading?
          <div style={{ textAlign: "center" }}><Spin /><span>  响应最慢事务数据加载中...</span></div>
          :
          (this.state.dv.length>0?
          <Chart 
            height={400}  scale={scale}
            padding={[ 0, 30, 80, 220]} 
            data={this.state.data} forceFit >
            <Coord transpose />
            <Axis name="serviceName" label={label} tickLine={tickLine}/>
            <Axis name="time" title />
            <Tooltip />
            <Geom type="interval" position="serviceName*time*uri" size={15} tooltip={['serviceName*time*uri', (serviceName, time) => {
            return {
              //自定义 tooltip 上显示的 title 显示内容等。
              name:'时间',
              value:time+'ms',
            };
            }]}/>
          </Chart> 
        :<Exception title='无数据' desc="没有加载到服务平均响应时间的数据" img="images/exception/404.svg" actions={<div />}/>)
         */}
      </Fragment>
    )
  }
}