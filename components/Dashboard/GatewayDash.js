import React,{PureComponent,Fragment} from 'react';
import {base} from '../../services/base';
import { withRouter } from 'react-router-dom';
import { Row,Col,Card,Table,Tooltip as AntdTooltip,Modal,message } from 'antd';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import moment from 'moment';
import LoadingComponent from '../../common/LoadingComponent';
import {GlobalHeaderContext} from '../../context/GlobalHeaderContext'
import { getServicecalltimes,getServiceavgtimes,getAppMonit,getApigatewayApp } from '../../services/monitor';
import {getApp} from '../../services/dashApi';
import './Overview.less';
const confirm = Modal.confirm;

const scale = {
  date:{
    type:'timeCat',
    mask:'MM-DD',
  },
  avgtime: {
    min: 0,
    alias:'平均响应时间（ms）'
  },
  times: {
    min: 0,
    alias:'次数'
  }
}

const getEvn = (evns,id)=>{
  let evn;
  evns.forEach(e=>{
    if(e.id===id)evn=e;
  })
  return evn;
}

let lastActiveEnvId;
class GatewayDash extends PureComponent {
  state = {
    serviceAvgtimes:[],
    serviceCalltimes:[],
    data:[],
    environments:[],
    evnGetwayInstances:[],
    getwayInstancesTableLoading:true,
    loading:false,
  };
  componentDidMount(){
    //环境
    base.getEnvironments().then(envs=>{
      let activeEnv;
      if(envs.length>0){
        envs.forEach(element=>{
          if(this.props.environment === element.id){
            activeEnv = element.id
          }
        })
        if(!activeEnv){
          activeEnv = envs[0].id
        }
        this.setState({environments:envs,activeEnv});
      }
      let env = getEvn(envs,activeEnv);
      lastActiveEnvId = env.id;
    });
  }
  showConfirm=(service)=> {
    confirm({
      title: '该服务未部署在当前环境中，是否切换环境并查看服务详情?',
      onOk:()=> {
      }
    });
  }
  onServiceDetail=(service)=>{
    if(this.state.activeEnv === this.props.environment){
      getApp(service.groupId).then(data=>{
        if(data){
          this.props.history.push({ pathname: `/apis/${service.id}` });
        }
      }).catch(err=>{
        message.error('当前环境下不存在该应用')
      })
    }else{
      message.error('该服务未部署在当前环境中，无法查看服务详情，请切换全局环境后在点击查看')
    }
  }
  renderTabContent=()=>{
    if(this.state.activeEnv&&this.state.activeEnv!==lastActiveEnvId){
      let env = getEvn(this.state.environments,this.state.activeEnv);
      lastActiveEnvId = env.id;
      getApigatewayApp(env.code).then(data=>{
        if(data.contents.length===0){
          this.setState({evnGetwayInstances:[],getwayInstancesTableLoading:false});
        }else{
          getAppMonit(data.contents[0].id).then(data=>{
            let evnGetwayInstances = [];
            let getwayInstancesTableLoading = false;
            if(data === undefined){
              this.setState({evnGetwayInstances,getwayInstancesTableLoading:false});
              return ;
            }
            data.containers.forEach((d,i)=>{
              evnGetwayInstances.push({tname:'实例'+(i+1),...d});
            })
            this.setState({evnGetwayInstances,getwayInstancesTableLoading});
          });
        }
      });
      this.setState({ loading:true });
      let st = moment().subtract(1,'month').format('x');
      let et = moment().add(1,'day').format('x');
      getServiceavgtimes({startTime:st,endTime:et,aggregate:false,rownum:7},{'AMP-ENV-ID':lastActiveEnvId}).then(data=>{
        this.setState({serviceAvgtimes:data});
      }).catch(err=>{
        this.setState({serviceAvgtimes:[]});
      });
      getServiceavgtimes({startTime:st,endTime:et,aggregate:true},{'AMP-ENV-ID':lastActiveEnvId}).then(data=>{
        console.log('xxx',data.slice(0,7));
        this.setState({ data:data.slice(0,7),loading:false });
      }).catch(err=>{
        this.setState({ data:[],loading:false });
      });
      getServicecalltimes({startTime:st,endTime:et,aggregate:false,rownum:7},{'AMP-ENV-ID':lastActiveEnvId}).then(data=>{
        this.setState({serviceCalltimes:data});
      }).catch(err=>{
        this.setState({serviceCalltimes:[]});
      });
    }

    const { serviceAvgtimes,serviceCalltimes,data } = this.state;
    const columns = [{
      title: '实例',
      dataIndex: 'tname',
      width:'20%',
    }, {
      title: 'CPU使用率(%)',
      dataIndex: 'cpu',
      width:'20%',
    }, {
      title: '内存使用率(%)',
      dataIndex: 'memory',
      width:'20%',
    }, {
      title: '流入速率(kb/s)',
      dataIndex: 'rx',
      width:'20%',
      render:(text,record)=>{
        if(text){
          return text.toFixed(2);
        }else{
          return text
        }
      }
    }, {
      title: '流出速率(kb/s)',
      dataIndex: 'tx',
      width:'20%',
      render:(text,record)=>{
        if(text){
          return text.toFixed(2);
        }else{
          return text
        }
      }
    }];
    const chart = (
      <Chart padding={[ 20, 80, 80, 80]}
        height={320} scale={scale} forceFit data={data} >
        <Axis
          name="avgtime" title
          grid={null}
          label={{
            textStyle:{
              fill: '#fdae6b'
            }
          }} />
        <Axis title 
          name="times" />
        <Tooltip />
        <Geom type="interval" position="date*times"/>
        <Geom tooltip={['date*avgtime', (date, avgtime) => {
          return {
            //自定义 tooltip 上显示的 title 显示内容等。
            name:'平均响应时间',
            value:avgtime+'ms'
          };
          }]} type="line" position="date*avgtime" color="#fdae6b" size={3} shape="smooth" />
        <Geom tooltip={['date*avgtime', (date, avgtime) => {
          return {
            //自定义 tooltip 上显示的 title 显示内容等。
            name:'平均响应时间',
            value:avgtime+'ms'
          };
          }]} type="point" position="date*avgtime" color="#fdae6b" size={3} shape="circle" />
      </Chart>
    )
    // const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <Table dataSource={this.state.evnGetwayInstances} columns={columns} pagination={false} />
        <Row style={{marginTop:24}}>
          <Col xl={12} lg={12} md={12} sm={24} xs={24}>
            <div className={'salesBar'}>
            <h4 className={'rankingTitle'}>周服务统计</h4>
            <LoadingComponent 
              loadingText='周服务统计'
              loading={this.state.loading} 
              exceptionText='服务统计暂无数据'
              exception={ data.length>0 ? false : true } >
              {chart}
            </LoadingComponent>
            </div>
          </Col>
          <Col xl={6} lg={6} md={6} sm={24} xs={24}>
            <div className={'salesRank'} style={{padding:'0 16px 0 16px'}} >
              <h4 className={'rankingTitle'}>Top7调用次数</h4>
              <ul className={'rankingList'}>
                {serviceCalltimes.map((item, i) => (
                  <li key={i}>
                    <span className={i < 3 ? 'active' : ''}>{i + 1}</span>
                    <AntdTooltip title={item.service.name}>
                      <span 
                        onClick={()=>this.onServiceDetail(item.service)} 
                        style={{cursor:'pointer'}} >
                        {item.service.name.length > 8 ? item.service.name.slice(0,8)+'...':item.service.name}
                        </span>
                    </AntdTooltip>
                    <span>{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
          <Col xl={6} lg={6} md={6} sm={24} xs={24}>
            <div className={'salesRank'} style={{padding:'0 16px 0 16px'}}>
              <h4 className={'rankingTitle'}>Top7平均响应缓慢服务</h4>
              <ul className={'rankingList'}>
                {serviceAvgtimes.map((item, i) => (
                  <li key={i}>
                    <span className={i < 3 ? 'active' : ''}>{i + 1}</span>
                    <AntdTooltip title={item.service.name}>
                      <span 
                        onClick={()=>this.onServiceDetail(item.service)} 
                        style={{cursor:'pointer'}} >
                        {item.service.name.length > 8 ? item.service.name.slice(0,8)+'...':item.service.name}
                      </span>
                    </AntdTooltip>
                    <span>{item.avgTime}ms</span>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Fragment>
    )
  }
  render() {
    let operationTabList = [];
    this.state.environments.forEach(env => {
      if(base.currentEnvironment.isMain){
        operationTabList.push({key:env.id,tab:env.name});
      }
    });
    return (
        <Card
          style={{ width: '100%' }}
          tabList={operationTabList}
          activeTabKey={this.state.activeEnv}
          onTabChange={(key) => this.setState({activeEnv:key})}>
          {this.renderTabContent()}
        </Card>
    );
  }
}
export default withRouter(props=>
  <GlobalHeaderContext.Consumer>
    {context=><GatewayDash {...props} environment={context.environment} changeEnv={context.changeEnvironment}/>}
  </GlobalHeaderContext.Consumer>
)