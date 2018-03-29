import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar,TimelineChart,Bar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Card,Tabs,DatePicker,Tooltip } from 'antd';
import { Chart, Geom, Axis, Tooltip as Tooltip1 } from 'bizcharts';
import numeral from 'numeral';
import moment from 'moment';
import { getTimeDistance } from '../../utils/utils';
import '../Application/Overview.less';

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
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

class ApiDashboard extends React.Component {
  state = {
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
    const { rangePickerValue } = this.state;
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
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="网关状态监控"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={<Field label="实例总数" value="2"/>}
              contentHeight={46}
            >
            <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
              <Row style={{marginBottom:8}}>
                <Col span={8}><span>警告</span></Col>
                <Col span={8}><span>严重</span></Col>
                <Col span={8}><span>离线</span></Col>
              </Row>
              <Row>
                <Col span={8}><span>0</span></Col>
                <Col span={8}><span>0</span></Col>
                <Col span={8}><span>0</span></Col>
              </Row>
            </div>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="API异常监控"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={<Field label="API总数" value="1000"/>}
              contentHeight={46}
            >
            <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
              <Row style={{marginBottom:8}}>
                <Col span={12}><span>API报错告警</span></Col>
                <Col span={12}><span>API超时告警</span></Col>
              </Row>
              <Row>
                <Col span={12}><span>0</span></Col>
                <Col span={12}><span>0</span></Col>
              </Row>
            </div>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="月平均响应时长"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={'200ms'}
              footer={<Field label="当日访问量" value={numeral(1234).format('0,0')} />}
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={visitData} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="调用次数"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(6560).format('0,0')}
              footer={<Field label="日均调用" value={numeral(100).format('0,0')} />}
              contentHeight={46}
            >
              <MiniBar
                height={46}
                data={visitData}
              />
            </ChartCard>
          </Col>
        </Row>
        <Card bordered={false} bodyStyle={{ padding: 0 }}>
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
        <Card title={'响应最慢的服务排名'} bordered={false} bodyStyle={{ padding:'24px 48px' }} style={{marginTop:24}}>
          <div style={{width:'100%'}}><Bar height={295} data={salesData} /></div>
        </Card>
        <Card title={'报错次数最多的服务排名'} bordered={false} bodyStyle={{ padding:'24px 48px' }} style={{marginTop:24}}>
          <div style={{width:'100%'}}><Bar height={295} data={salesData} /></div>
        </Card>
      </Fragment>
    )
  }
}

export default ApiDashboard;