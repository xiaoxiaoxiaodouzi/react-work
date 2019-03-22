import React, { Component } from 'react';
import { Table,Modal,message } from 'antd';
import {  deleteNodes } from '../services/cce';
import { base } from '../services/base';
import constants from '../services/constants'
import ContainerNode from '../routes/setting/ContainerNode'
import { GrafanaModal, BaseProgress } from '../common/SimpleComponents'

// const statusMap = ['success', 'warning', 'error'];
// const status = ['正常', '警告', '严重'];
export default class ServicesTable extends Component {

  // shouldComponentUpdate(nextProps, nextState){
  //     return true;
  // }
  state = {
    clusterData: [],
    grafanaNodeVisible: false,
    visibleMaAdd: false,
    containerVisible: false,
    tenants: [],
    tenant: '',      //更改服务器类型 选择的租户
    clusterId: '',     //选中的服务器
    loading: false,
  }

  openContainer = (record) => {
    this.setState({ containerVisible: true, containerName: record.nodeName })
  }

  //删除节点
  deleteNode = (record) => {
    Modal.confirm({
      title: '是否删除节点【'+record.nodeName+"】?",
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        //调用修改租户详情接口
        deleteNodes(record.clusterId, record.nodeName).then(data => {

          message.success('删除节点成功！')
        })
      }
    });
    
  }

  render() {
   
    const columns = [{
      title: '主机', dataIndex: 'nodeName', width:180,
      render: (text, record) => {
        var ip = text;
        if (text.indexOf('.node') !== -1) {
          ip = text.replace('.node', '').replace(/-/g, '.');
        } else if (text.indexOf('.master') !== -1) {
          ip = text.replace('.master', '').replace(/-/g, '.');
        }
        return <a onClick={e => this.setState({ grafanaNodeVisible: true, ip })}>{text}</a>;
      }
    // }, {
    //   title: '状态', dataIndex: 'nodeStatus', width: 100,
    //   render: (text, record) => {
    //     return <Badge status={statusMap[text]} text={status[text]} />;
    //   }
    }, {
      title: 'Docker版本', dataIndex: 'dockerVersion', width: 120, align:'right'
    }, {
      title: '容器数', dataIndex: 'container', width: 80, align:'right', render: (text, record) => {
        return <a style={{display:'block'}} onClick={() => this.openContainer(record)}>4</a>
      }
    }, {
      title: 'CPU/内存', dataIndex: 'nodeCPU', width: 120, align:'left', 
      render:(value,record)=>`${record.nodeCPU} 核/${record.nodeMem} G`
    }, {
      title: 'CPU使用率', dataIndex: 'nodeCpuRate',
      render: (value, record) => <BaseProgress percent={value} />
    }, {
      title: '内存使用率', dataIndex: 'nodeMemRate',
      render: (value, record) => <BaseProgress percent={value} />
    }];
    if (this.props.opType !== 'look') {
      columns.push({
        title: '操作', dataIndex: 'actions', width: 80, render: (value, record) => {
          return <a onClick={() => this.deleteNode(record)}>删除</a>
        }
      })
    }
    return (
      <div>
       
        <Table columns={columns} dataSource={this.props.nodeDetailList } pagination={false}></Table>
           
        <GrafanaModal visible={this.state.grafanaNodeVisible} title="节点资源监控" onCancel={e => { this.setState({ grafanaNodeVisible: false }) }} url={base.configs.globalResourceMonitUrl + constants.GRAFANA_URL.node + '&var-node=' + this.state.ip} />
        {/* <ClusterDocModal masterIP={this.props.masterIP} token={this.props.token} handleBtnAdd={this.handleBtnAdd} onCancel={() => this.setState({ visibleMaAdd: false })} visibleMaAdd={this.state.visibleMaAdd} /> */}
        <ContainerNode visible={this.state.containerVisible} onCancel={() => this.setState({ containerVisible: false })} containerName={this.state.containerName} />
       
      </div>
    )


  }

}