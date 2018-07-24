import React,{Component} from 'react';
import { Card,List,Avatar,Row,Col,Progress,Tooltip,message } from 'antd';

import { getApplicationRes,getTenantManager} from '../../services/tenants'
import { getAppCount,getServiceCount,getUserCount } from '../../services/monitor';
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
    this.setState({loading:true});
    base.getUserTenants('admin').then(data=>{
      // console.log('tenant',data);
      let requestUserManage = [];
      let requestRes = [];
      let requestAppCount = [];
      let requestMiddlewareCount = [];
      let requestServiceCount = [];
      let requestUserCount = [];
      data.forEach(element => {
        if(element.tenant_type && element.tenant_type.indexOf('PAAS') !== -1 && element.tenant_code){
          element.description = '管理员：无';
          element.users = [];
          requestUserManage.push(getTenantManager(element.id));
          requestUserCount.push(getUserCount(element.id));
          requestRes.push(getApplicationRes(element.tenant_code)); 
          environments.forEach(item=>{
            requestAppCount.push(getAppCount({tenant:element.tenant_code,type:'web'},{'AMP-ENV-ID':item.id}));
            requestMiddlewareCount.push(getAppCount({tenant:element.tenant_code,type:'middleware'},{'AMP-ENV-ID':item.id}))
            requestServiceCount.push(getServiceCount({tenant:element.tenant_code},{'AMP-ENV-ID':item.id}));
          })
          /* requestAppCount.push(getAppCount({tenant:element.tenant_code,type:'web'}));
          requestMiddlewareCount.push(getAppCount({tenant:element.tenant_code,type:'middleware'})); */
          tempData.push(element);
        }
      });
      this.props.onGetTenantCount(tempData.length);
      this.setState({data:tempData,total:tempData.length});
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
        // console.log('data',tempData);
        this.setState({data:tempData});
      });
      Promise.all(requestUserCount).then(values=>{
        let tempUserCount = 0;
        console.log('users',values);
        values.forEach((element,index)=>{
          tempData[index].userCount = element;
          tempUserCount += element;
        });
        this.setState({data:tempData});
        this.props.onGetUserCount(tempUserCount);
      }).catch(err=>{
        this.props.onGetUserCount(0);
        message.error('获取租户下的用户数目出错');
      });
      Promise.all(requestRes).then(values=>{
        // console.log('res',values);
        values.forEach((element,index)=>{
          tempData[index].cpuTotal = element.cpuUsedTotal;
          tempData[index].ramTotal = element.memoryUsedTotal/1024/1024/1024;
        });
        this.setState({data:tempData});
      });
      Promise.all(requestAppCount).then(values=>{
        const tempCount = values.length / environments.length;
        for(let j=0; j<tempCount; j++){
          tempData[j].appCount = 0;
          for(let i =0; i<environments.length; i++){
            tempData[j].appCount += values[j*environments.length + i];
          }
        }
        this.setState({data:tempData});
      }).catch(err=>{
        this.setState({ loading:false });
        message.error('获取租户下的应用数目出错');
      });
      Promise.all(requestMiddlewareCount).then(values=>{
        const tempCount = values.length / environments.length;
        for(let j=0; j<tempCount; j++){
          tempData[j].middlewareCount = 0;
          for(let i =0; i<environments.length; i++){
            tempData[j].middlewareCount += values[j*environments.length + i];
          }
        }
        this.setState({data:tempData});
      }).catch(err=>{
        this.setState({ loading:false });
        message.error('获取租户下的中间件数目出错');
      });
      Promise.all(requestServiceCount).then(values=>{
        console.log('serveices',values);
        const tempCount = values.length / environments.length;
        for(let j=0; j<tempCount; j++){
          tempData[j].serviceCount = 0;
          for(let i =0; i<environments.length; i++){
            tempData[j].serviceCount += values[j*environments.length + i];
          }
        }
        this.setState({data:tempData,loading:false});
      }).catch(err=>{
        this.setState({ loading:false });
        message.error('获取租户下的服务数目出错');
      });
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