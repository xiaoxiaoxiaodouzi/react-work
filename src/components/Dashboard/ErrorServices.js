import React,{Fragment} from 'react'
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import { getServiceerrortimes } from '../../services/monitor'
import moment from 'moment';
import { base } from '../../services/base';
import LoadingComponent from '../../common/LoadingComponent';
import { DataSet } from '@antv/data-set';
import { message } from 'antd';


export default class ErrorServices extends React.Component{
  state={
    data:[],
    dv:[],
    loading:false
  }
  componentDidMount(){
    this.setState({loading:true})
    let st = moment().subtract(1,'month').format('x');
    let et = moment().format('x');
    getServiceerrortimes({startTime:st,endTime:et,tenant:base.tenant}).then(data=>{
      let datas=[];
      this.setState({loading:false})
      if(data.length > 0){
        data.forEach(item=>{
          let params={
            count:item.count,
            serviceName:item.service.name+': '+item.service.methods+' '+item.service.uri,
            service:item.service
          }
          datas.push(params)
        })
      }
      const ds = new DataSet();
      const dv = ds.createView().source(datas);
      dv.source(datas).transform({
          type: 'sort',
          callback(a, b) { // 排序依据，和原生js的排序callback一致
            return a.count - b.count > 0;
          }
      }); 
      this.setState({
        data:dv,
        dv:datas,
      })
    }).catch(err=>{
      message.error('获取服务报错次数统计出错')
      this.setState({loading:false})
    })
  }

  handleClick=(e)=>{
    if(e.data){
      let id=e.data._origin.service.id;
      let appId=e.data._origin.service.groupId;
      const history=this.props.history;
      history.push({pathname:'/apps/'+appId+'/apis/'+id})
    }
  }
  render(){
    const scale = {
      count: {
        alias:'次',
        type: "linear",
        tickCount: 10,
      }
    };
    const label = {
      offset:12,
      formatter(text, item, index) {
        let t=text.split(':')[0]
        if (t.length > 20) { 
          return t.substring(0, 20) + "..."; 
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
        height={400} scale={scale}
        padding={[ 0, 30, 80, 220]} 
        data={this.state.data} forceFit >
        <Coord transpose />
        <Axis name="serviceName" label={label} tickLine={tickLine}/>
        <Axis name="count" title />
        <Tooltip />
        <Geom type="interval" position="serviceName*count" size={15} tooltip={['serviceName*count', (serviceName, count) => {
        return {
          name:'次数',
          value:count
        };
        }]}/>
      </Chart> 
    )
    return (
      <Fragment>
        <LoadingComponent 
          loadingText='错误服务次数'
          loading={this.state.loading} 
          exceptionText='没有加载到服务报错次数的数据'
          exception={ this.state.dv.length >0 ? false : true } >
          {chart}
        </LoadingComponent> 
        {/* this.state.loading?
          <div style={{ textAlign: "center" }}><Spin /><span>  错误服务次数数据加载中...</span></div>
          :
          (this.state.dv.length>0?
          <Chart 
            height={400} scale={scale}
            padding={[ 0, 30, 80, 220]} 
            data={this.state.data} forceFit >
            <Coord transpose />
            <Axis name="serviceName" label={label} tickLine={tickLine}/>
            <Axis name="count" title />
            <Tooltip />
            <Geom type="interval" position="serviceName*count" size={15} tooltip={['serviceName*count', (serviceName, count) => {
            return {
              name:'次数',
              value:count
            };
            }]}/>
          </Chart> 
        :
        <Exception title='无数据' desc="没有加载到服务报错次数的数据" img="images/exception/404.svg" actions={<div />}/>
      )
         */}
      </Fragment>
    )
  }
}