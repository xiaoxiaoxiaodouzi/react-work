import React, { PureComponent,Fragment } from 'react';
import { Chart, Axis, Tooltip, Geom, Coord } from 'bizcharts';
import { message } from 'antd';
import LoadingComponent from '../../../common/LoadingComponent';
import { getTransactionInfoSlow } from '../../../services/dashApi';
import { DataSet } from '@antv/data-set';
import ResourcesModal from '../../../common/ResourcesModal/ResourcesModal'
export default class Component extends PureComponent {
  state = {
    data:[],      //柱状图数据
    dv:[],        //判断是否有数据
    loading:false,
  };

  componentDidMount(){
    
    let appCode = this.props.appCode;
    let queryParam={
      resultNum:10,
      from:this.props.from,
      to:this.props.to
    }
    
    this.getTransactionInfoSlow(appCode,queryParam);
  }

  componentWillReceiveProps(nextProps){
      let appCode = nextProps.appCode;
      let queryParam={
        resultNum:10,
        from:nextProps.from,
        to:nextProps.to
      }

      this.getTransactionInfoSlow(appCode,queryParam);
   
  }

  getTransactionInfoSlow=(appCode,queryParam)=>{
    this.setState({
      loading:true,
    })
    let datas = [];
    getTransactionInfoSlow(appCode, queryParam).then(data=>{
      this.setState({
        loading:false,
      })
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
          data:dv,
          dv:data,
        })
      }
    }).catch(err=>{
      message.error('获取最慢响应事务失败')
      this.setState({loading:false})
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
    const chart = (
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
    )
    return (
      <Fragment>
        <LoadingComponent 
          loadingText='响应最慢事务数据'
          loading={this.state.loading} 
          exceptionText='没有加载到当前应用的最慢响应事务的数据'
          exception={ this.state.dv.length >0 ? false : true } >
          {chart}
        </LoadingComponent> 
      {/* this.state.loading?
        <div style={{ textAlign: "center" }}><Spin /><span>  响应最慢事务数据加载中...</span></div>
        :
        (this.state.dv.length>0?
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
          <Exception title="无数据" desc="没有加载到当前应用的最慢响应事务的数据" img="images/exception/404.svg" actions={<div />}/>
      )
       */}
      </Fragment>
    );
  }
}