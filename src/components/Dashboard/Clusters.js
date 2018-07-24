import React,{PureComponent,Fragment} from 'react';
import { Row,Col,Card,Icon,Tooltip,Table } from 'antd';
import { ChartCard } from 'ant-design-pro/lib/Charts';

const clusters = [{
  key:'cluster1',
  name:'集群1'
},{
  key:'cluster2',
  name:'集群2'
},{
  key:'cluster3',
  name:'集群3'
}];
const columns = [
  { title: '主机', dataIndex: 'node', },
  { title: '资源使用', dataIndex: 'resource' },
  { title: '操作', dataIndex: '', render: () => <a onClick={()=>{console.log('aaa')}}>查看历史曲线</a> },
];

const data = [
  { key: 1, node: 'John Brown', resource: 32, description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.' },
  { key: 2, node: 'Jim Green', resource: 42, description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.' },
  { key: 3, node: 'Joe Black', resource: 32, description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.' },
];
export default class Clusters extends PureComponent {
  state = {
    operationkey: 'cluster1',
  };
  renderTabContent=(operationkey)=>{
    let cluster = '';
    clusters.forEach(element=>{
      if(element.key === operationkey){
        cluster = element.name;
      }
    });

    const topColResponsiveProps = { xs:24,sm:12,md:12,lg:12,xl:6,style:{ marginBottom: 24 }};
    return (
      <Fragment>
        <div className="card-title">{cluster}概况</div>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>内存(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total="17.97%"
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>CPU(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total="17.97%"
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>磁盘(使用率)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total="17.97%"
              contentHeight={46}/>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              style={{border:'none'}}
              title={<Fragment><span style={{marginRight:16}}>输入/输出流量(bytes)</span><Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip></Fragment>}
              total="2498/1929"
              contentHeight={46}/>
          </Col>
        </Row>
        <div className="card-title">节点列表</div>
        <Table
          size={'small'}
          columns={columns}
          expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
          dataSource={data}
        />
      </Fragment>
    )
    //return <span>{cluster}</span>
  }
  render() {
    let contentList = {};
    let operationTabList = [];
    clusters.forEach(cluster => {
      operationTabList.push({key:cluster.key,tab:cluster.name});
      contentList[cluster.key]=this.renderTabContent(cluster.key);
    });
    return (
        <Card
          style={{ width: '100%' }}
          tabList={operationTabList}
          activeTabKey={this.state.operationkey}
          onTabChange={(key) => this.setState({operationkey:key})}>
          {contentList[this.state.operationkey]}
        </Card>
    );
  }
}