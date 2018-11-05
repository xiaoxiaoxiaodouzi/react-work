import React,{Component} from 'react';
import { Card,List,Avatar,Row,Col,Progress,Tooltip,message } from 'antd';

import { getApplicationRes,getTenantManager,getUserTenants} from '../../services/tenants'
import { getUserCount,queryAppCount,queryServiceCount } from '../../services/monitor';
import { base } from '../../services/base';
import constants from '../../services/constants';
import './Overview.less';
export default class TenantList extends Component {
  state = {
    total:0,
    data:[],
    loading:false,
  };
  componentDidMount(){
    this.loadData();
  }
  shouldComponentUpdate(nextProps, nextState){
    if(this.state !== nextState){
      return true;
    }else{
      return false;
    }
  }
  loadData = ()=>{
    const environments = base.environments;
    let tempData = [];
    let tempServiceCount = 0;
    let tempAppCount = 0;
    let tempMiddlewareCount = 0;
    this.setState({loading:true});
    //获取租户信息并根据租户code获取appcount、usercount、servicecount等信息
    getUserTenants('admin').then(data=>{
      let requestUserManage = [];
      let requestRes = [];
      let requestUserCount = [];
      data.forEach(element => {
        if(element.tenant_type && element.tenant_type.indexOf('PAAS') !== -1 && element.tenant_code){
          element.description = '管理员：无';
          element.users = [];
          element.appCount = 0;
          element.middlewareCount = 0;
          element.serviceCount = 0;
          requestUserManage.push(getTenantManager(element.id));
          requestUserCount.push(getUserCount(element.id));
          requestRes.push(getApplicationRes(element.tenant_code)); 
          tempData.push(element);
        }
      });
      this.props.onGetTenantData({tenantCount:tempData.length},'tenant');
      this.setState({ data:tempData,total:tempData.length,loading:false });
      Promise.all(requestUserManage).then(values=>{
        values.forEach((element,index)=>{
          element.forEach(item=>{
            tempData[index].users.push(item.name);
          })
        });
        tempData.forEach(element=>{
          if(element.users.length){
            element.description ='管理员：'+ element.users.toString();
          }
        });
        this.setState({data:tempData});
      });
      Promise.all(requestUserCount).then(values=>{
        let tempUserCount = 0;
        values.forEach((element,index)=>{
          tempData[index].userCount = element;
          tempUserCount += element;
        });
        this.setState({data:tempData});
        this.props.onGetTenantData({userCount:tempUserCount},'user');
      }).catch(err=>{
        message.error('获取租户下的用户数目出错');
      });
      Promise.all(requestRes).then(values=>{
        values.forEach((element,index)=>{
          tempData[index].cpuTotal = element.cpuUsedTotal.toFixed(1);
          tempData[index].ramTotal = (element.memoryUsedTotal/1024/1024/1024).toFixed(1);
        });
        this.setState({data:tempData});
      });
      environments.forEach(item=>{
        queryAppCount({format:'tenantAndType'},{'AMP-ENV-ID':item.id}).then(data=>{
          if(data){
            tempData.forEach(element=>{
              if(data[element.tenant_code]){
                if(data[element.tenant_code].web){
                  element.appCount += data[element.tenant_code].web;
                  tempAppCount += data[element.tenant_code].web;
                }
                
                if(data[element.tenant_code].app){
                  element.appCount += data[element.tenant_code].app;
                  tempAppCount += data[element.tenant_code].app;
                }
                
                if(data[element.tenant_code].app){
                  element.middlewareCount += data[element.tenant_code].middleware; 
                  tempMiddlewareCount += data[element.tenant_code].middleware;
                }
                
              }
            });
            this.props.onGetTenantData({ appCount:tempAppCount,middlewareCount:tempMiddlewareCount } , 'app');
            this.setState({ data:tempData });
          }
        });
        queryServiceCount({format:'tenant'},{'AMP-ENV-ID':item.id}).then(data=>{
          if(data){
            tempData.forEach(element=>{
              if(data[element.tenant_code]){
                element.serviceCount += data[element.tenant_code];
                tempServiceCount += data[element.tenant_code];
              }
            })
            this.props.onGetTenantData({serviceCount:tempServiceCount},'service');
            this.setState({ data:tempData });
          }
          
        }) 
      })
    });
  }
  renderProgress = (percent)=>{
    if(percent > 100){
      percent = 100;
    }
    if(percent<constants.PROGRESS_STATUS[0]){
      return <Progress percent={percent} status='normal' className='normal' />
    }else if(percent >= constants.PROGRESS_STATUS[0] && percent < constants.PROGRESS_STATUS[1]){
      return <Progress percent={percent} status='normal' className='warning' />
    }else{
      return <Progress percent={percent} status='normal' className='danger' />
    }
  }
  render() {
    const { data,total,loading } = this.state;
    return (
      <Card
        bodyStyle={{ padding:'0px 24px 24px 24px' }}
        bordered={false}
        title="租户列表"
      >
        <List
          size="large"
          pagination={{
            pageSize: 5,
            total:total
          }}
          loading={loading}
          dataSource={data}
          renderItem={item => (
            <List.Item key={item.id}>
            <Row style={{width:'100%'}}>
              <Col span={8}>
                <List.Item.Meta
                  avatar={<Avatar src={constants.PIC.tenant} />}
                  title={<span>{item.name}</span>}
                  description={item.description && <Tooltip title={item.description}><span style={{marginRight:48}}>{item.description.slice(0,15)+(item.description.length>15?'...':'')}</span></Tooltip>}
                />
              </Col>
              <Col span={6}>
                <div style={{width:'100%',padding:'0 16px 0 16px'}}>
                  <Row >
                    <Col span={6}><span>用户</span></Col>
                    <Col span={6}><span>应用</span></Col>
                    <Col span={6}><span>中间件</span></Col>
                    <Col span={6}><span>服务</span></Col>
                  </Row>
                  <Row>
                    <Col span={6}><span>{item.userCount}</span></Col>
                    <Col span={6}><span>{item.appCount}</span></Col>
                    <Col span={6}><span>{item.middlewareCount}</span></Col>
                    <Col span={6}><span>{item.serviceCount}</span></Col>
                  </Row>
                </div>
              </Col>
              <Col span={2} style={{textAlign:'right',fontSize:18,paddingRight:16,lineHeight:'42px'}}>
                配额
              </Col>
              <Col span={8}>
                <div style={{width:'100%'}}>
                  <Row >
                    <Col span={12}><span>CPU（核）：{item.cpuTotal}/{item.cpus}</span></Col>
                    <Col span={12}>
                      { this.renderProgress(parseInt(item.cpuTotal/item.cpus*100, 10)) }
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}><span>内存（GB）：{item.ramTotal}/{item.rams}</span></Col>
                    <Col span={12}>
                      { this.renderProgress(parseInt(item.ramTotal/item.rams*100, 10)) }
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
            </List.Item>
          )}
        />
      </Card>
    );
  }
}