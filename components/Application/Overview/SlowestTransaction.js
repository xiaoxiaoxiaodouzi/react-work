import React, { PureComponent,Fragment } from 'react';
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import { Spin } from 'antd';
import { getTransactionInfoSlow } from '../../../services/dashApi';
import { DataSet } from '@antv/data-set';
import ResourcesModal from '../../../common/ResourcesModal/ResourcesModal'
export default class Component extends PureComponent {
  state = {
    data:[]
  };

  componentDidMount(){
    let appCode = this.props.appCode;
    let queryParam={
      resultNum:10
    }
    let datas = [];
    getTransactionInfoSlow(appCode, queryParam).then(data=>{
      if (Array.isArray(data) && data.length>0){
        data.forEach(item=>{
          datas.push({
            name: item.application,
            time: item.elapsed
          })
        })
        const ds = new DataSet();
        const dv = ds.createView().source(datas);
        dv.source(datas)
          .transform({
            type: 'sort',
            callback(a, b) { // 排序依据，和原生js的排序callback一致
              return a.time - b.time > 0;
            }
          }); 
        this.setState({
          data: dv
        })
      }else{
        this.setState({
          data: []
        })
      }
    })
  }

  handleClick=(e)=>{
    if (e.shape && e.shape._id){
      //切割 ，先暂时这样写,因为生产数据前面会默认加上这个 后续想办法.
      let url=e.shape._id.split('chart-geom0-')[1];
      if(url){
        this.setState({
          visible:true,
          rect: url
        })
      }
    }
  }
  render() {
    const scale = {
      time: {
        alias:'时间（ms）',
        type: "linear",
        tickCount: 10,
      }
    };
    const label = {
      offset:12,
      formatter(text, item, index) {
        if (text.length > 30) { 
          return text.substring(0, 30) + "..."; 
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
          <div>
            <Chart 
              onPlotClick={e => this.handleClick(e)} 
              height={400} scale={scale}  
              padding={[ 0, 30, 80, 220]} 
              data={this.state.data} forceFit >
              <Coord transpose />
              <Axis name="name" label={label} tickLine={tickLine}/>
              <Axis name="time" title />
              <Tooltip />
              <Geom type="interval" position="name*time" size={15} tooltip={['name*time', (name, time) => {
              return {
                //自定义 tooltip 上显示的 title 显示内容等。
                name:'耗时',
                value:time+'(ms)'
              };
              }]}/>
            </Chart> 
            <ResourcesModal appCode={this.props.appCode} visible={this.state.visible} onCancle={e => this.setState({ visible: false })} type='rect' datas={this.state.rect} />
          </div>
          :
        <div style={{ textAlign: "center" }}><Spin /><span>  响应最慢事务数据加载中...</span></div>
      }
      </Fragment>
    );
  }
}