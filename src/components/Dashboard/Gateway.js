import React,{PureComponent,Fragment} from 'react';
import { Row,Col,Card,Icon,Tooltip } from 'antd';
import { ChartCard } from 'ant-design-pro/lib/Charts';
import {getAppMonit,getApigatewayApp} from '../../services/monitor'
import {base} from '../../services/base'
import constants from '../../services/constants';

export default class Gateway extends PureComponent {
  state = {
    getwayInstances:[]
  };

  componentDidMount(){
    getApigatewayApp(base.tenant).then(data=>{
      if(data && data.contents && data.contents.length > 0){
        getAppMonit(data.contents[0].id).then(data=>{
          let gateway = {
            gatewayNormal:0,
            gatewayWarning:0,
            gatewayError:0,
            gateWayTotal:0
          };
          //this.props.onGetGatewayData(gateway);
          if(data && data.containers){
            let getwayInstances = data.containers;
            //console.log('getwayInstancesb',getwayInstances);
            getwayInstances.forEach(element => {
              if(element.cpu < constants.PROGRESS_STATUS[0] && element.memory < constants.PROGRESS_STATUS[0]){
                gateway.gatewayNormal ++;
              }else if(
                (element.cpu >= constants.PROGRESS_STATUS[0] 
                && element.cpu < constants.PROGRESS_STATUS[1])
                || (element.memory >= constants.PROGRESS_STATUS[0] 
                && element.memory < constants.PROGRESS_STATUS[1])
              ){
                gateway.gatewayWarning ++;  
              }else{
                gateway.gatewayError ++;
              }
            });
            if(getwayInstances.length>0)this.setState({operationkey:getwayInstances[0].name});
            this.setState({getwayInstances});
            gateway.gateWayTotal = getwayInstances.length;
            this.props.onGetGatewayData(gateway);
          }
        });
      }
    });
  }

  renderTabContent=(ins)=>{
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>内存(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={ins.memory+'%'}
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>CPU(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={ins.cpu+'%'}
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>磁盘(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total={ins.filesystem+'%'}
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>输入/输出流量(bytes)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total="无数据"
              contentHeight={46}/>
          </Col>
        </Row>
    )
  }
  render() {
    let contentList = {};
    let operationTabList = [];
    this.state.getwayInstances.forEach((ins,i) => {
      operationTabList.push({key:ins.name,tab:'网关实例'+(i+1)});
      contentList[ins.name]=this.renderTabContent(ins);
    });
    return (
      <Fragment>
        { this.state.getwayInstances.length > 0 &&
          <Card
            style={{ width: '100%',marginBottom:24 }}
            tabList={operationTabList}
            activeTabKey={this.state.operationkey}
            onTabChange={(key) => this.setState({operationkey:key})}>
            {contentList[this.state.operationkey]}
          </Card>
        }
      </Fragment>
    );
  }
}