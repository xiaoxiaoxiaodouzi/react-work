import React, { Fragment } from 'react';
import { ChartCard,Field,MiniArea,MiniBar } from 'ant-design-pro/lib/Charts';
import { Row,Col,Icon,Card,Tooltip } from 'antd';
import Gateway from '../../components/Dashboard/Gateway';
import moment from 'moment';
import {base} from '../../services/base'
import { getServiceerrortimes,getServiceavgtimes } from '../../services/monitor'
import SlowServices from '../../components/Dashboard/SlowServices'
import ErrorServices from '../../components/Dashboard/ErrorServices'
import '../Application/Overview.less';
import {formateValue} from '../../utils/utils'

class ApiDashboard extends React.Component {
  state = {
    serviceAvgtimes:[],
    serviceCalltimes:[],
    avgTime:'',
    avgTimeToday:'',
    totalCallTimes:'',
    avgCallTimes:'',
    gatewayNormal:'',
    gatewayWarning:'',
    gatewayError:'',
    gateWayTotal:'',
  }
  componentDidMount(){
    let st = moment().subtract(1,'month').format('x');
    let et = moment().add(1,'day').format('x');
    getServiceerrortimes({startTime:st,endTime:et}).then(data=>{
      
    });
    getServiceavgtimes({startTime:st,endTime:et,aggregate:true,tenant:base.tenant}).then(data=>{
      console.log('data',data);
      if(data.length > 0){

        let tempData = data.slice(0,12);
        let serviceAvgtimes = [];
        let serviceCalltimes = [];
        let avgTime = 0;
        let totalCallTimes = 0;
        let avgTimeToday = 0;
        let avgCallTimes = 0;
        tempData.forEach(element=>{
          serviceAvgtimes.push({
            x:moment(element.date).format('HH:mm:ss'),
            y:parseInt(element.avgtime,10)
          });
          serviceCalltimes.push({
            x:moment(element.date).format('HH:mm:ss'),
            y:parseInt(element.times,10)
          })
          avgTime += element.avgtime;
          totalCallTimes += element.times;
        });
        if(tempData.length > 0 && tempData[tempData.length-1].avgtime){
          avgTimeToday = tempData[tempData.length-1].avgtime;
          avgTime = avgTime/tempData.length;
          avgCallTimes = totalCallTimes/tempData.length;
        }
        console.log('data',tempData,serviceAvgtimes,serviceCalltimes);
        this.setState({ 
          serviceAvgtimes,serviceCalltimes,avgTime,totalCallTimes,
          avgTimeToday,avgCallTimes
        });
      }      
    });
    /* getServiceavgtimes({startTime:st,endTime:et,aggregate:false,rownum:7}).then(data=>{
      //this.setState({serviceAvgtimes:data});
    });
    getServicecalltimes({startTime:st,endTime:et,aggregate:false,rownum:7}).then(data=>{
      //this.setState({serviceCalltimes:data});
    }); */
  }
  onGetGatewayData=(gateway)=>{
    this.setState({ ...gateway });
  }
  render(){
    const { serviceAvgtimes,serviceCalltimes,
      gatewayNormal,gatewayWarning,gatewayError,gateWayTotal,
      avgTime,totalCallTimes,avgTimeToday,avgCallTimes 
    } = this.state;
    console.log('data111',serviceAvgtimes,serviceCalltimes);
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="网关状态"
              action={<Tooltip title='当前环境的服务网关状态'><Icon type="info-circle-o" /></Tooltip>}
              footer={<Field label="实例总数" value={gateWayTotal}/>}
              contentHeight={88}
            >
            <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
              <Row style={{marginBottom:8}}>
                <Col span={8}><span>正常</span></Col>
                <Col span={8}><span>警告</span></Col>
                <Col span={8}><span>严重</span></Col>
              </Row>
              <Row>
                <Col span={8}><span>{formateValue(gatewayNormal)}</span></Col>
                <Col span={8}><span>{formateValue(gatewayWarning)}</span></Col>
                <Col span={8}><span>{formateValue(gatewayError)}</span></Col>
              </Row>
            </div>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="服务状态"
              action={<Tooltip title={`当前租户所属服务在当前环境一周内的调用状况统计`}><Icon type="info-circle-o" /></Tooltip>}
              footer={<Field label="服务总数" value="--"/>}
              contentHeight={88}
            >
            <div style={{top:-70,position:'absolute',width:'100%',textAlign:'center'}}>
              <Row style={{marginBottom:8}}>
                <Col span={12}><span>调用报错</span></Col>
                <Col span={12}><span>调用超时</span></Col>
              </Row>
              <Row>
                <Col span={12}><span>--</span></Col>
                <Col span={12}><span>--</span></Col>
              </Row>
            </div>
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="月平均响应时长"
              action={<Tooltip title="一个月内服务平均响应时长状况统计"><Icon type="info-circle-o" /></Tooltip>}
              total={formateValue(avgTime)}
              footer={<Field label="当日平均响应时长" value={formateValue(avgTimeToday)==='--'?'--':avgTimeToday+'(ms)'} />}
              contentHeight={46}
            >
              <MiniArea color="#975FE4" data={formateValue(serviceAvgtimes)==='--'?'--':serviceAvgtimes+'(ms)'} />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="调用次数"
              action={<Tooltip title="一个月内服务调用次数状况统计"><Icon type="info-circle-o" /></Tooltip>}
              total={formateValue(totalCallTimes)}
              footer={<Field label="日均调用" value={formateValue(avgCallTimes)} />}
              contentHeight={46}
            >
              <MiniBar
                height={46}
                data={serviceCalltimes}
              />
            </ChartCard>
          </Col>
        </Row>
        <Gateway onGetGatewayData={this.onGetGatewayData}/>
        <Card title={<span>Top10服务平均响应时间<Tooltip title="最近一月"><Icon style={{marginLeft:8,fontSize:14,cursor:'pointer',color:'rgba(0, 0, 0, 0.45)'}} type="info-circle-o" /></Tooltip></span>} bordered={false} bodyStyle={{ padding:'24px 48px' }}>
          <SlowServices history={this.props.history}/>
        </Card>
        <Card title={<span>Top10服务报错次数<Tooltip title="最近一月"><Icon style={{marginLeft:8,fontSize:14,cursor:'pointer',color:'rgba(0, 0, 0, 0.45)'}} type="info-circle-o" /></Tooltip></span>} bordered={false} bodyStyle={{ padding:'24px 48px' }} style={{marginTop:24}}>
          <ErrorServices history={this.props.history}/>
        </Card>
      </Fragment>
    )
  }
}

export default ApiDashboard;