import React,{Fragment} from 'react'
import { Row,Col,Icon,Card,Tabs,DatePicker,Tooltip } from 'antd';
import { ChartCard,Field,MiniArea,MiniBar,TimelineChart,Bar } from 'ant-design-pro/lib/Charts';
import PageHeader from 'ant-design-pro/lib/PageHeader';
// import './PageHeaderLayout.less';
import Clusters from '../../components/Dashboard/Clusters';
import Dynamic from '../../components/Dashboard/Dynamic';
import numeral from 'numeral';
import moment from 'moment';

const TabPane = Tabs.TabPane;

class ResourceDashboard extends React.Component {
  state={
    operationkey:'app',
  }
  renderTabBody = (operationkey)=>{
    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="节点状态监控"
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={<Field label="集群总数" value="2"/>}
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
                <Col span={8}><span>警告</span></Col>
                <Col span={8}><span>严重</span></Col>
                <Col span={8}><span>异常</span></Col>
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
              title="访问量"
              total={numeral(8846).format('0,0')}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={
                <div>
                  <Field label="最近变更时间" value={moment(new Date()).format('YYYY-MM-DD')}/>
                </div>}
              contentHeight={46}
            >
              <MiniBar
                height={46}
              />
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              title="用户数"
              total={numeral(6560).format('0,0')}
              action={<Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip>}
              footer={
                <div>
                  <Field label="最近变更时间" value={moment(new Date()).format('YYYY-MM-DD')}/>
                </div>}
              contentHeight={46}
            >
              <MiniBar
                height={46}
              />
            </ChartCard>
          </Col>
        </Row>
        <Clusters operationKey={operationkey}/>
        <Dynamic operationKey={operationkey}/>
        <span>{operationkey}</span>
      </Fragment>
    )
  }
  render() {
    const { operationkey } = this.state;
    const breadcrumbList = [{
      title: '资源监控'
    }];
    const tabList = [{
      key: 'app',
      tab: '应用统计',
    }, {
      key: 'service',
      tab: '服务统计',
    }];
    let contentList = {
      app:this.renderTabBody('app'),
      service:this.renderTabBody('service')
    };
    return (
      // <PageHeaderLayout
      //   tabList={tabList}
      //   tabActiveKey={operationkey}
      //   onTabChange={(key)=>this.setState({operationkey:key})} >
      //   {contentList[operationkey]}
      // </PageHeaderLayout>
      <div>
        <PageHeader breadcrumbList={breadcrumbList} key="pageheader" tabList={tabList}  tabActiveKey={operationkey} onTabChange={(key)=>this.setState({operationkey:key})}/>
        {contentList[operationkey]}
      </div>
    );
  }
}

export default ResourceDashboard;