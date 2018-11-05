import React, { Fragment } from 'react';
import { Row,Col,Card,Tabs,DatePicker,Divider,Button } from 'antd';
import moment from 'moment';
import { getTimeDistance } from '../../../utils/utils';
import RequestTime from './RequestTime';
import ResponseTime from './ResponseTime';
import SlowestTransaction from './SlowestTransaction';
import AppResourceInfoModal from './AppResourceInfoModal';
import ApplicationTopo from '../Topo/ApplicationTopo';
import './Overview.less';
import {base} from '../../../services/base';
import Link from 'react-router-dom/Link';
import constants from '../../../services/constants';
import Exception from 'ant-design-pro/lib/Exception';

import RenderAuthorized  from 'ant-design-pro/lib/Authorized';
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

/* 应用概览页面，使用图表组件显示应用相关信息*/
class RunningResource extends React.PureComponent {
  state = {
    salesType: 'all',
    currentTabKey: 'performance',
    pointData:[],
    rangePickerValue: getTimeDistance('hour',1),
    appCode:'',
    APMChecked:false,
    type:'apps'
  };
  componentDidMount(){
    const {history}=this.props;
    this.setState({
      type:history.location.pathname.indexOf('apps')>0?'apps':'middlewares'
    })
    if(this.props.appCode){
      this.setState({ deployMode:this.props.deployMode,appCode: this.props.appCode, APMChecked: this.props.APMChecked, appId: this.props.appId,currentTabKey:this.props.APMChecked?'performance':'resource'});
      if(this.props.deployMode === "k8s"){
        this.setState({
          visible:true
        })
      }else{
        this.setState({
          visible:false,
          currentTabKey:'performance'
        })
      }
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps !== this.props){
      this.setState({ deployMode:nextProps.deployMode,appCode: nextProps.appCode, APMChecked: nextProps.APMChecked, appId: nextProps.appId,currentTabKey:nextProps.APMChecked?'performance':'resource'});
      if(nextProps.deployMode === "k8s"){
        this.setState({
          visible:true
        })
      }else{
        this.setState({
          visible:false,
          currentTabKey:'performance'
        })
      }
    }

  }
  handleRangePickerChange = (rangePickerValue) => {
    this.setState({
      rangePickerValue,
    });
  };
  selectDate = (type,num) => {
    this.setState({
      rangePickerValue: getTimeDistance(type,num),
    });
  };
  isActive(type,num) {
    const { rangePickerValue } = this.state;
    const value = getTimeDistance(type,num);
    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return;
    }
    if (
      rangePickerValue[0].isSame(value[0], type) &&
      rangePickerValue[1].isSame(value[1], type)
    ) {
      return "currentDate";
    }
  }
  topoNodeClick = (name,type)=>{
    //过滤不必要显示的节点
    if(name !== this.state.appCode && type!=='USER' && type!=='UNKNOWN'){
      this.setState({AppResourceInfoModalVisible:true,AppModalCode:name});
    }
  }

  handleClick=()=>{
    const { history} =this.props;
    history.push({pathname:`setting`})  
  }
  disabledDate = (date) =>{

    let dates = date < moment().subtract('days', 2) || ( date> moment().endOf('day'));
    return dates;
  }
  
  render(){
    const Authorized = RenderAuthorized(base.allpermissions);
    const { rangePickerValue } = this.state;
    const salesExtra = (
      <div className='salesExtraWrap'>
        <div className='salesExtra'>
          <a className={this.isActive('hour',1)} onClick={() => this.selectDate('hour',1)}>1小时</a>
          <a className={this.isActive('hour',2)} onClick={() => this.selectDate('hour',2)}>2小时</a>
          <a className={this.isActive('hour',3)} onClick={() => this.selectDate('hour',3)}>3小时</a>
          <a className={this.isActive('day',1)} onClick={() => this.selectDate('day',1)}>一天</a>
          <a className={this.isActive('day',2)} onClick={() => this.selectDate('day',2)}>两天</a>
          {/* <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>一天</a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>一周</a>
          <a className={this.isActive('month')} onClick={() => this.selectDate('month')}>一月</a> */}
          {/* <a className={this.isActive('year')} onClick={() => this.selectDate('year')}>一年</a> */}
        </div>
        <RangePicker
          value={rangePickerValue}
          onChange={this.handleRangePickerChange}
          style={{ width: 256 }}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={this.disabledDate}
        />
      </div>
    );
    //定义拓扑图节点点击事件
    const topoEvents = {
      click:(n)=>{
        let nodes = n.nodes;
        if(nodes.length>0){
            let selectNode = nodes[0];
            let infos = selectNode.split('^');
            let name = infos[0];
            let type = infos[1];
            this.topoNodeClick(name,type);
        }
      }
    }
    let fromTime = moment(rangePickerValue[0]).format('x');
    let toTime = moment(rangePickerValue[1]).format('x');
    const url = `${base.configs[constants.CONFIG_KEY.GLOBAL_RESOURCE_MONIT_URL]}/dashboard/db/application?var-tenant=${base.tenant}&var-application=${this.state.appCode}&from=${fromTime}&to=${toTime}&theme=light`
    return (
      <Fragment>
        <Card style={{margin:"0px 24px 24px 24px"}} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className='salesCard'>
            <Tabs onChange={e=>this.setState({currentTabKey:e})} tabBarExtraContent={salesExtra} size="large" tabBarStyle={{ marginBottom: 24 }} activeKey={this.state.currentTabKey}>
              <TabPane tab="性能监控" key="performance" disabled={this.props.APM_URL?false:true}>
                {this.state.APMChecked?
                  <div style={{ padding: '0px 24px 0px 24px' }}>
                    <Row>
                      <div className="card-title" >链路拓扑</div>
                      <ApplicationTopo
                        appCode={this.props.appCode}
                        from={moment(rangePickerValue[0]).format('x')}
                        to={moment(rangePickerValue[1]).format('x')}
                        events={topoEvents} />
                      <AppResourceInfoModal appCode={this.state.AppModalCode} history={this.props.history} handleCancel={e => { this.setState({ AppResourceInfoModalVisible: false }) }} visible={this.state.AppResourceInfoModalVisible} />
                    </Row>
                    <Divider style={{ marginBottom: 24, marginTop: 24 }} />
                    <RequestTime appCode={this.props.appCode} rangePickerValue={rangePickerValue} />
                    <Divider style={{ marginBottom: 24, marginTop: 24 }} />
                    <Row gutter={24}>
                      <Col span={8}>
                        <div className="card-title">应用响应时间分布</div>
                        <ResponseTime appCode={this.props.appCode} rangePickerValue={rangePickerValue} />
                      </Col>
                      <Col span={16}>
                        <div className="card-title">TOP10响应慢服务</div>
                        <SlowestTransaction appCode={this.props.appCode} 
                         from={moment(rangePickerValue[0]).format('x')}
                         to={moment(rangePickerValue[1]).format('x')}
                        rangePickerValue={rangePickerValue} />
                      </Col>
                    </Row>
                  </div>
                  :
                  <div style={{margin:24}}>
                    <Exception title='   ' desc="没有开启APM监控服务" img="images/exception/404.svg" actions={
                    <div>
                      <Link to={`/${this.state.type}/${this.state.appId}/setting#APMchecked`}> 
                        <Authorized authority='app_performance' noMatch={null}>
                          <Button type='primary' > 开启APM监控</Button>
                        </Authorized>
                      </Link>
                      
                    </div>} />
                  </div>
                }
                
              </TabPane>
              {this.state.visible?
                 <TabPane tab="资源监控" key="resource" disable={this.state.visible}>
                 <div style={{ padding: '0px 24px 0px 24px' }}>
                   <iframe  title='resource' src={url} frameBorder="0" style={{ width: '100%',height:'1300px' }}></iframe>
                 </div>
               </TabPane>:""
            }
             
              {/* <TabPane tab="事务" key="transaction">
                <Transaction 
                  appCode={this.props.appCode} 
                  from={moment(rangePickerValue[0]).format('x')} 
                  to={moment(rangePickerValue[1]).format('x')} />
              </TabPane> */}
            </Tabs>
          </div>
        </Card>
      </Fragment>
    )
  }
}

export default RunningResource;
