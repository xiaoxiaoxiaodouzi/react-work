import React,{Fragment} from 'react'
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import {getServiceerrortimes} from '../../services/monitor'
import moment from 'moment';
import {base} from '../../services/base'
import { DataSet } from '@antv/data-set';
import { Spin } from 'antd';

export default class ErrorServices extends React.Component{
  state={
    data:[]
  }
  componentDidMount(){
    let st = moment().subtract(1,'month').format('x');
    let et = moment().format('x');
    getServiceerrortimes({startTime:st,endTime:et,tenant:base.tenant}).then(data=>{
      let datas=[];
      if(data.length > 0){
        data.forEach(item=>{
          let params={
            count:item.count,
            serviceName:item.service.name
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
        data:dv
      })
    })
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
        if (text.length > 20) { 
          return text.substring(0, 20) + "..."; 
        }else{ 
          return text; 
        }
      },
    }
    const tickLine = {
      lineWidth: 1, // 刻度线宽
      stroke: '#ccc', // 刻度线的颜色
      length: 5, // 刻度线的长度, **原来的属性为 line**,可以通过将值设置为负数来改变其在轴上的方向
    }
    return (
      <Fragment>
        {this.state.data?
          <Chart 
            onPlotClick={e => this.handleClick(e)} 
            height={400} scale={scale}
            padding={[ 0, 30, 80, 220]} 
            data={this.state.data} forceFit >
            <Coord transpose />
            <Axis name="serviceName" label={label} tickLine={tickLine}/>
            <Axis name="count" title />
            <Tooltip />
            <Geom type="interval" position="serviceName*count" size={15} tooltip={['serviceName*count', (serviceName, count) => {
            return {
              //自定义 tooltip 上显示的 title 显示内容等。
              name:'次数',
              value:count
            };
            }]}/>
          </Chart> 
        :<div style={{ textAlign: "center" }}><Spin /><span>  错误服务次数数据加载中...</span></div>
        }
      </Fragment>
    )
  }
}