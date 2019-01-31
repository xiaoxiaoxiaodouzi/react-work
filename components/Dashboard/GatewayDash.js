import React, { PureComponent } from 'react';
import { base } from '../../services/base';
import { Card, Table} from 'antd';
import { getApigatewayApp } from '../../services/cce'
import './Overview.less';
import { resourceusage } from '../../services/monit';

class GatewayDash extends PureComponent {
  state = {
    environments: [],
    evnGetwayInstances: [],
    getwayInstancesTableLoading: true,
  };
  componentDidMount() {
    //环境
      let envs=base.environments;
      if (envs.length > 0) {
        const evnCode = envs.code;
        this.setState({ environments: envs, activeEnv:evnCode });
        this.loadData(evnCode);
      }
  }
  loadData = (envCode)=>{
    getApigatewayApp(envCode).then(data => {
      if (data.contents.length === 0) {
        this.setState({ evnGetwayInstances: [], getwayInstancesTableLoading: false });
      } else {
        resourceusage(data.contents[0].id).then(data => {
          let evnGetwayInstances = [];
          let getwayInstancesTableLoading = false;
          if (data && data.containers ) {
            data.containers.forEach((d, i) => {
              evnGetwayInstances.push({ tname: '实例' + (i + 1), ...d });
            })
          }
          this.setState({ evnGetwayInstances, getwayInstancesTableLoading });
        });
      }
    });
  }
  tabChange = (key)=>{
    this.setState({ activeEnv: key });
    this.loadData(key)
  }

  render() {
    let operationTabList = [];
    this.state.environments.forEach(env => {
      operationTabList.push({ key: env.code, tab: env.name });
    });
    const columns = [{
      title: '实例',
      dataIndex: 'tname',
      width: '20%',
    }, {
      title: 'CPU使用率(%)',
      dataIndex: 'cpu',
      width: '20%',
    }, {
      title: '内存使用率(%)',
      dataIndex: 'memory',
      width: '20%',
    }, {
      title: '流入速率(kb/s)',
      dataIndex: 'rx',
      width: '20%',
      render: (text, record) => {
        if (text) {
          return text.toFixed(2);
        } else {
          return text
        }
      }
    }, {
      title: '流出速率(kb/s)',
      dataIndex: 'tx',
      width: '20%',
      render: (text, record) => {
        if (text) {
          return text.toFixed(2);
        } else {
          return text
        }
      }
    }];
    return (
      <Card
        style={{ width: '100%' }}
        tabList={operationTabList}
        activeTabKey={this.state.activeEnv}
        onTabChange={(key) => this.tabChange(key)}>
        <Table dataSource={this.state.evnGetwayInstances} columns={columns} pagination={false} />
      </Card>
    );
  }
}
export default GatewayDash;