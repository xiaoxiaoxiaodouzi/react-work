import React, { PureComponent } from 'react';
import { getRespHistogram} from '../../../services/dashApi';
import moment from 'moment';
import { message } from 'antd';
import LoadingComponent from '../../../common/LoadingComponent';
import { Chart, Axis, Tooltip, Geom, Coord, Guide, Legend} from 'bizcharts';
import { DataSet } from '@antv/data-set';
import ResourcesModal from '../../../common/ResourcesModal/ResourcesModal'
import PropTypes from 'prop-types';
const Html = Guide.Html;
export default class ResponseTime extends PureComponent {
  state = {
    visible:false,
    visitData:[],
    dv:[],
    loading:false
  };

  componentDidMount(){
    if(this.props){
      this.loadData(this.props);
    }
  }

  loadData=(props)=>{
    this.setState({
      loading:true,
    })
    const startTime = moment(props.rangePickerValue[0]).format('x')
      const endTime = moment(props.rangePickerValue[1]).format('x')
      let queryParam = {
        from: startTime,
        to: endTime,
        nodeName: props.appCode
      }
      getRespHistogram(props.appCode, queryParam).then(data => {
        this.setState({loading:false})
        if (Object.keys(data).length !== 0) {
          let visitData = [];
          let total = 0;
          let sortDate = [];
          for (var i in data) {
            total += data[i];
            visitData.push({
              item: i,
              count: data[i]
            })
          }
          //数组排序 1s 3s 5s slow erro;先暂时这样写 后台还不知道怎么处理排序问题
          sortDate.push(visitData[1]);
          sortDate.push(visitData[0]);
          sortDate.push(visitData[4]);
          sortDate.push(visitData[2]);
          sortDate.push(visitData[3]);

          const ds = new DataSet();
          const dv = ds.createView();
          dv.source(sortDate).transform({
            type: 'percent',
            field: 'count',
            dimension: 'item',
            as: 'percent'
          });
          this.setState({
            visitData: dv,
            dv:sortDate,
            total: total,
          })
        }
      }).catch(err=>{
        message.error('查询node的响应时长失败')
        this.setState({loading:false})
      })
  }
  componentWillReceiveProps(nextProps){
    if (nextProps && nextProps!==this.props){
      this.loadData(nextProps);
    }
  }

  handleClick=(e)=>{
    if (e.target._id){
      let time = e.target._id.split('chart-geom0-1-')[1];
      if(time){
        if(time==='1s'){
          time = 1
        }
        if (time === '3s') {
          time = 3
        } 
        if (time === '5s') {
          time = 5
        } 
        if (time === 'Slow') {
          time = 6
        } 
        if (time === 'Error') {
          time = 'exception'
        }
        this.setState({
          visible:true,
          pie: time
        })
      }
    }
  }

  render() {
    const html = `<div style="color:#8c8c8c;font-size:1.16em;text-align: center;width: 10em;">数量<br><span style="color:#262626;font-size:2.5em">${this.state.total?this.state.total:0}</span></div>`
    const chart = (
      <div>
        <Chart data={this.state.visitData} onPlotClick={e => this.handleClick(e)}   padding={[-50, 100, 80,0]} forceFit>
          <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
          <Axis name="percent" />
          <Legend position='right' offsetY={-window.innerHeight / 2 + 250}/>
          <Tooltip
            showTitle={false}
          />
          <Guide >
            <Html position={['50%', '50%']} html={html} alignX='middle' alignY='middle' />
          </Guide>
          <Geom
            type="intervalStack"
            position="percent"
            color='item'
            tooltip={['item*percent', (item, percent) => {
              percent = percent * this.state.total;
              return {
                name: item,
                value: percent
              };
            }]}
            style={{ lineWidth: 1, stroke: '#fff' }}
          >
          </Geom>
        </Chart>
        <ResourcesModal 
          appCode={this.props.appCode} 
          from={moment(this.props.rangePickerValue[0]).format('x')}
          to={moment(this.props.rangePickerValue[1]).format('x')}
          visible={this.state.visible} 
          onCancle={e => this.setState({ visible: false })} 
          type='pie' datas={this.state.pie}/>
      </div>
    )
    return(
      <div>
        <LoadingComponent 
          loadingText='响应分布数据'
          loading={this.state.loading} 
          exceptionText='没有加载到当前应用的响应时间分布的数据'
          exception={ this.state.dv.length >0 ? false : true } >
          {chart}
        </LoadingComponent> 
        {/* this.state.loading?
          <div style={{ textAlign: "center" }}><Spin /><span>  响应分布数据加载中...</span></div>
          :
          (this.state.dv.length>0?
              <div>
                <Chart data={this.state.visitData} onPlotClick={e => this.handleClick(e)}   padding={[-50, 100, 80,0]} forceFit>
                  <Coord type={'theta'} radius={0.75} innerRadius={0.6} />
                  <Axis name="percent" />
                  <Legend position='right' offsetY={-window.innerHeight / 2 + 250}/>
                  <Tooltip
                    showTitle={false}
                  />
                  <Guide >
                    <Html position={['50%', '50%']} html={html} alignX='middle' alignY='middle' />
                  </Guide>
                  <Geom
                    type="intervalStack"
                    position="percent"
                    color='item'
                    tooltip={['item*percent', (item, percent) => {
                      percent = percent * this.state.total;
                      return {
                        name: item,
                        value: percent
                      };
                    }]}
                    style={{ lineWidth: 1, stroke: '#fff' }}
                  >
                  </Geom>
                </Chart>
                <ResourcesModal 
                  appCode={this.props.appCode} 
                  from={moment(this.props.rangePickerValue[0]).format('x')}
                  to={moment(this.props.rangePickerValue[1]).format('x')}
                  visible={this.state.visible} 
                  onCancle={e => this.setState({ visible: false })} 
                  type='pie' datas={this.state.pie}/>
              </div>
            :
            <Exception title=' ' desc="没有加载到当前应用的响应时间分布的数据" img="images/exception/404.svg" actions={<div />}/>)
         */} 
      </div>
    )
  }
}

ResponseTime.propTypes = {
 /*  from: PropTypes.string.isRequired,//开始日期
  to: PropTypes.string.isRequired,//结束日期
  visitData: PropTypes.array,//响应数据 */
  appCode: PropTypes.string,//目标应用Code
}