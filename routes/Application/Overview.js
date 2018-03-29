import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar,TimelineChart,Bar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Card,Tabs,DatePicker,Tooltip } from 'antd';
import { Chart, Geom, Axis, Tooltip as Tooltip1 } from 'bizcharts';
import numeral from 'numeral';
import moment from 'moment';
import NotAccessable from '../../common/NotAccessable';
import { getTimeDistance } from '../../utils/utils';
import './Overview.less';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const pointData = [];
for (let i = 0; i < 20; i += 1) {
  pointData.push({
    comsumingTime: Math.floor(Math.random() * 100) + 10,
    times: Math.floor(Math.random() * 100) + 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: (new Date().getTime()) + (1000 * 60 * 30 * i),
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
}
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}
const visitData = [];
const beginDay = new Date().getTime();
for (let i = 0; i < 20; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + (1000 * 60 * 60 * 24 * i))).format('YYYY-MM-DD'),
    y: Math.floor(Math.random() * 100) + 10,
  });
}
const salesData = [];
/* 应用概览页面，使用图表组件显示应用相关信息*/
export default class AppOverview extends React.PureComponent {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };
  selectDate = (type) => {
    this.setState({
      rangePickerValue: getTimeDistance(type),
    });
  };
  isActive(type) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return "currentDate";
    }
  }
  render(){
    const params = this.props.match.params;
    const { salesType,currentTabKey,rangePickerValue } = this.state;
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    const salesExtra = (
      <div className='salesExtraWrap'>
        <div className='salesExtra'>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>今日</a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>本周</a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>本月</a>
          <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>全年</a>
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    );
    const pointCols = {
      comsumingTime: { alias: '耗时' },
      times: { alias: '时间' }
    };
    return (
      <Fragment>
        <Row gutter={24} style={{margin:"24px 12px 0px 12px"}}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="健康状况"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={<span style={{fontSize:28,color:"green"}}>健康</span>}
              footer={
                <div>
                  <Field label="资源使用情况" value={<span style={{color:'green'}}>正常</span>}/>
                  <Field label="服务平均响应" value="100ms"/>
                  <Field label="服务报错次数" value="X次"/>
                </div>}
            >
            {/* <div style={{fontSize:28,color:"green",top:20}}>健康</div> */}
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="访问量"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(8846).format('0,0')}
              footer={<Field label="当日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={52}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="访问人数"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(6560).format('0,0')}
              footer={<Field label="日访问人数" value={numeral(1234).format('0,0')} />}
              contentHeight={52}
            >
              <MiniBar
                height={52}
                data={visitData}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="稳定运行时长"
              total="20天"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={
                <div>
                  <Field label="最近变更时间" value={moment(new Date()).format('YYYY-MM-DD')}/>
                </div>}
              contentHeight={52}
            >
              <MiniBar
                height={52}
              />
            </ChartCard>
          </Col>
        </Row>
        <Card style={{margin:"0px 24px 24px 24px"}} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className='salesCard'>
            <Tabs tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="运行情况" key="sales">
                {/* <div style={{height:400,padding:128}}>
                  <NotAccessable />
                </div> */}
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className='salesBar'>
                      <h3 style={{marginLeft:48}}>请求处理性能统计散点图</h3>
                      <Chart height={295} data={pointData} scale={pointCols} forceFit>
                        <Tooltip1 showTitle={false} crosshairs={{type:'cross'}} itemTpl='<li data-index={index} style="margin-bottom:4px;"><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}<br/>{value}</li>'/>
                        <Axis name='comsumingTime' title='耗时'/>
                        <Axis name='times' title='时间'/>
                        <Geom type='point' position="times*comsumingTime" opacity={0.65} shape="circle" size={4} tooltip={['times*comsumingTime', (comsumingTime, times) => {
                          return {
                            value: comsumingTime + '(ms), ' + times + '(s)'
                          };
                        }]} />
                      </Chart>
                      {/* <Bar height={295} title="请求处理性能统计散点图" data={visitData} /> */}
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className='salesRank'>
                      <h3 className='rankingTitle'>服务平均响应时长排名</h3>
                      <ul className='rankingList'>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span className={i < 3 ? 'active' : ''}>{i + 1}</span>
                            <span>{item.title}</span>
                            <span>{numeral(item.total).format('0,0')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="资源情况" key="views">
                <div style={{ padding: '0px 48px 72px 48px' }}>
                  <h3>CPU使用情况</h3>
                  <TimelineChart
                    height={400}
                    data={offlineChartData}
                    titleMap={{ y1: '实例1', y2: '实例2' }}
                  />
                </div>
                <div style={{ padding: '0px 48px 72px 48px' }}>
                  <h3>内存占用</h3>
                  <TimelineChart
                    height={400}
                    data={offlineChartData}
                    titleMap={{ y1: '实例1', y2: '实例2' }}
                  />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Card>
      </Fragment>
    )
  }
}
