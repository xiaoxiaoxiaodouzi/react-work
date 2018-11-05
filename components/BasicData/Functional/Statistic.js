import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Row,Col,Card,Tabs,DatePicker } from 'antd';
import { getTimeDistance } from '../../../utils/utils';
import '../../Application/Overview/Overview.less';
import { Bar } from 'ant-design-pro/lib/Charts';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工专路 ${i} 号店`,
    total: 323234,
  });
}
const salesData = [];
for (let i = 0; i < 12; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  });
}

export default class Statistic extends Component {
  static propTypes = {
    prop: PropTypes
  }
  state = {
    rangePickerValue: getTimeDistance('today'),
  };
  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });
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
  render() {
     const salesExtra = (
      <div className='salesExtraWrap'>
        <div className='salesExtra'>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>一天</a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>一周</a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>一月</a>
        </div>
        <RangePicker
          value={this.state.rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
        />
      </div>
    ); 
    return (
        <Card style={{margin:"24px 24px 24px 24px"}} bordered={false} bodyStyle={{ padding: '0 24px 24px 24px' }}>
          <div className='salesCard'>
            <Tabs onChange={e=>this.setState({currentTabKey:e})} tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }} >
              <TabPane tab="性能监控" key="performance">
                <Row gutter={24}>
                  <Col span={16}>
                    <div style={{marginLeft:24}} className="card-title">应用响应时间分布</div>
                    <Bar height={292} data={salesData} />
                  </Col>
                  <Col span={8}>
                    <div className="card-title">TOP10响应慢服务</div>
                    <ul className='rankingList'>
                      {rankingListData.map((item, i) => (
                        <li key={item.title}>
                          <span className={i < 3 ? 'active' : ''}>{i + 1}</span>
                          <span>{item.title}</span>
                          <span>{item.total}</span>
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card> 
    )
  }
}
