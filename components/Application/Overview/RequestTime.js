import React, { PureComponent } from 'react';
import { Row, Col, message, Icon, Tooltip as AntdTip } from 'antd';
import NumberInfo from 'ant-design-pro/lib/NumberInfo';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import numeral from 'numeral';
import moment from 'moment';
import { getAPM } from '../../../services/dashApi';
import ResourcesModal from '../../../common/ResourcesModal/ResourcesModal'
import LoadingComponent from '../../../common/LoadingComponent';
import constants from '../../../services/constants';
export default class Component extends PureComponent {
  state = {
    pointData: [],
    avgTime: 0,
    loading: false
  };
  componentDidMount() {
    if (this.props.appCode && this.props.rangePickerValue.length) {
      const startTime = moment(this.props.rangePickerValue[0]).format('x');
      const endTime = moment(this.props.rangePickerValue[1]).format('x');
      this.queryApm(this.props.appCode, startTime, endTime);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.appCode && nextProps.rangePickerValue.length && this.props !== nextProps) {
      const startTime = moment(nextProps.rangePickerValue[0]).format('x');
      const endTime = moment(nextProps.rangePickerValue[1]).format('x');
      this.queryApm(nextProps.appCode, startTime, endTime);
    }
  }
  queryApm = (appCode, startTime, endTime) => {
    this.setState({
      loading: true
    })
    getAPM(appCode, {
      from: startTime,
      to: endTime,
    }).then(data => {
      this.setState({
        loading: false
      })
      let pointData = [];
      let total = 0;
      let avgTime = 0;

      if (data && data.scatter && data.scatter.dotList) {
        data.scatter.dotList.forEach((item, i) => {
          let state = "失败";
          if (item[3] === 0) {
            state = "成功";
          }

          if (item[3] === 1) {
            state = "失败";
          }
          pointData.push({
            z: item[0] > 1200 ? 1200 : item[0],
            y: item[0],
            x: item[1],
            traceId: item[2],
            gender: state
          });
          total += item[0];
        });
        avgTime = total / pointData.length;
        this.setState({ pointData, avgTime });
      } else {
        this.setState({ pointData: [] });
      }
    }).catch(err => {
      message.error('获取APM散点图数据失败')
      this.setState({ pointData: [], loding: false })
    });
  }

  onGetG2ChartInstance = (g2Chart) => {
    const chart = g2Chart;
    let guide = null;
    chart.on('mousedown', ev => {
      if(guide){
        guide.shape.remove;
      }
     /*  guide.shape.remove();
      chart._attrs.canvas.draw(); */
      guide = null;
      //数表点击的时候开始画图
      const shape = chart._attrs.canvas.addShape('rect', {
        attrs: {
          x: ev.x,
          y: ev.y,
          width: 1,
          height: 1,
          fill: 'red',
          opacity: 0.1
        }
      });
      guide = { shape, x: ev.x, y: ev.y };
    });
    chart.on('mousemove', ev => {
      if (guide) {
        guide.shape.attr({ width: ev.x - guide.x, height: ev.y - guide.y });
        chart._attrs.canvas.draw();
      }
    });
    chart.on('plotleave', ev => {
      if (guide) {
        guide.shape.remove();
        chart._attrs.canvas.draw();
        guide = null;
      }
    });
    chart.on('mouseup', ev => {
      if (guide) {
        const xStart = ev.x > guide.x ? guide.x : ev.x;
        const xEnd = ev.x > guide.x ? ev.x : guide.x;
        const yStart = ev.y > guide.y ? guide.y : ev.y;
        const yEnd = ev.y > guide.y ? ev.y : guide.y;

        const selected = [];

        chart.getAllGeoms()[0]._attrs.dataArray[0].forEach(function (item) {
          if (item.x >= xStart && item.x <= xEnd && item.y >= yStart && item.y <= yEnd) {
            selected.push(item);
          }
        });
        if (chart.getAllGeoms()[0]._attrs.dataArray[1])
          chart.getAllGeoms()[0]._attrs.dataArray[1].forEach(function (item) {
            if (item.x >= xStart && item.x <= xEnd && item.y >= yStart && item.y <= yEnd) {
              selected.push(item);
            }
          });
        guide.shape.remove();
        chart._attrs.canvas.draw();
        guide = null;
        //获取选中的数据
        if (selected.length > 0) {
          var ary = [];
          selected.forEach(item => {
            if (item._origin && item._origin.traceId) {
              let tempDot = {
                traceId: item._origin.traceId,
                time: item._origin.x,
                y: item._origin.y
              };
              ary.push(tempDot);
            }
          })
          this.setState({
            visible: true,
            dot: ary
          })
        }
      }
    });
  }
  render() {
    const { avgTime, pointData, loading } = this.state;
    const startTime = moment(this.props.rangePickerValue[0]).format('x');
    const endTime = moment(this.props.rangePickerValue[1]).format('x');
    const oneDay = 1000 * 60 * 60 * 24;
    let mask = 'MM-DD';
    let tickCount = 7;
    if ((endTime - startTime) / oneDay <= 2) {
      mask = 'HH:mm';
      tickCount = 12;
    } else if ((endTime - startTime) / oneDay > 2 && (endTime - startTime) / oneDay <= 5) {
      mask = 'MM-DD HH:mm';
      tickCount = 9;
    } else if ((endTime - startTime) / oneDay > 5 && (endTime - startTime) / oneDay < 365) {
      mask = 'MM-DD';
    } else if ((endTime - startTime) / oneDay > 364) {
      mask = 'YYYY-MM-DD';
    }
    const pointCols = {
      z: {
        alias: '耗时(ms)',
        max: 1200,
        min: 0
      },
      x: {
        alias: '时间',
        type: 'time',
        min: this.props.rangePickerValue[0],
        max: this.props.rangePickerValue[1],
        tickCount: tickCount,
        range: [0, 1],

        mask: mask   //时间显示根据时间粒度变化
      }
    };
    const time = numeral(avgTime).format('0,0');
    let color = constants.WARN_COLOR.normal;
    if (time > 500 && time <= 2000) {
      color = constants.WARN_COLOR.warn;
    } else if (time > 2000) {
      color = constants.WARN_COLOR.error;
    }

    const chart = (
      <Row>
        <Col span={4}>
          <NumberInfo style={{ margin: 24 }}
            subTitle={<span>请求次数<AntdTip title="默认采样率5%"><Icon style={{ marginLeft: 5 }} type="info-circle-o" /></AntdTip></span>}
            total={numeral(pointData.length).format('0,0')} />
          <NumberInfo style={{ margin: 24 }}
            subTitle={<span>平均耗时</span>}
            total={<span><span style={{ color: color }}>{numeral(avgTime).format('0,0')}</span>
              <span style={{ fontSize: 14, color: "#8c8c8c", marginLeft: 3 }}>ms</span></span>} />
        </Col>
        <Col span={20}>
          <div>
            <Chart height={360} data={pointData} scale={pointCols} forceFit onGetG2Instance={this.onGetG2ChartInstance}>
              <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/>{value}</li>' />
              <Axis name='z' />
              <Axis name='x' />
              <Legend />
              <Geom type='point' color={['gender', (value) => { return value === '失败' ? constants.WARN_COLOR.error : "#13c2c2" }]} position="x*z" opacity={0.65} shape="circle" size={2} tooltip={['x*y*gender', (x, y, gender) => {
                return {
                  name: "请求" + gender + '耗时：' + y + '(ms)',
                  value: '时间：' + moment(x).format('YYYY-MM-DD HH:mm:ss')
                };
              }]} />
            </Chart>
            <ResourcesModal appCode={this.props.appCode} visible={this.state.visible} onCancle={e => this.setState({ visible: false })} type='dot' datas={this.state.dot} />
          </div>
        </Col>
      </Row>
    )
    return (
      <div>
        <div className="card-title">
          请求耗时分布
        </div>
        <div style={{ height: 300 }}>
          <LoadingComponent
            loadingText='请求耗时数据'
            loading={loading}
            exceptionText='没有加载到当前应用的APM散点图的数据'
            exception={pointData.length > 0 ? false : true} >
            {chart}
          </LoadingComponent>
          {/* loading?
          <div style={{ textAlign: "center" }}><Spin /><span>  请求耗时数据加载中...</span></div>
          :
            (pointData.length > 0 ?
              <Row>
                <Col span={4}>
                  <NumberInfo style={{ margin: 24 }}
                    subTitle={<span>访问量</span>}
                    total={numeral(pointData.length).format('0,0')} />
                  <NumberInfo style={{ margin: 24 }}
                    subTitle={<span>平均耗时（毫秒）</span>}
                    total={numeral(avgTime).format('0,0')} />
                </Col>
                <Col span={20}>
                <div>
                  <Chart height={360} data={pointData} scale={pointCols} forceFit onGetG2Instance={this.onGetG2ChartInstance}>
                    <Tooltip showTitle={false} crosshairs={{ type: 'cross' }} itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/>{value}</li>' />
                    <Axis name='z' />
                    <Axis name='x' />
                    <Geom type='point' position="x*z" opacity={0.65} shape="circle" size={2} tooltip={['x*y', (x, y) => {
                      return {
                        name: '耗时：' + y + '(ms)',
                        value: '时间：' + moment(x).format('YYYY-MM-DD HH:mm:ss')
                      };
                    }]} />
                  </Chart> 
                  <ResourcesModal appCode={this.props.appCode} visible={this.state.visible} onCancle={e => this.setState({ visible: false })} type='dot' datas={this.state.dot} />
                </div>
              </Col>
            </Row>
              :
            <Exception title='无数据' desc="没有加载到当前应用的APM散点图的数据" img="images/exception/404.svg" actions={<div />}/>)
            } */
          }
        </div>
      </div>
    );
  }
}