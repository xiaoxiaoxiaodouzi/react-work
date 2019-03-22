import React, { Component } from 'react';
import { Card, Button, Icon, Modal, message, Dropdown, Menu, Select } from 'antd';
import { addHosts, editClusterType, reorderClusters, deleteCluster, getClusterInfo } from '../services/cce';
import moment from 'moment'
import {   ClusterDocModal } from '../common/SimpleComponents'
import AddCluster from '../routes/setting/AddCluster';
import ServicesTable from './ServicesTable';

// const statusMap = ['Health', 'warning', 'error'];
// const status = ['正常', '警告', '严重'];
const Option = Select.Option
export default class ClusterServices extends Component {

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

  componentDidMount() {
    getClusterInfo().then(data => {
      if (data) {
        this.setState({
          ...data
        })
      }
    })
  }


  static getDerivedStateFromProps(props, state) {
    if (props.clusterData !== state.clusterData) {
      return ({ clusterData: props.clusterData, loading: false })
    }
    if (props.loading !== state.loading) {
      return ({ loading: props.loading })
    }
    return null;
  }

  //加入集群按钮
  handleBtnAdd = (e) => {
    let id = this.state.id;
    let ip = this.state.ip;
    let reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    if (ip && ip !== '主机ip') {
      if (reg.test(ip)) {
        addHosts(id, ip).then((data) => {
          if (data) {
            message.success('主机加入集群成功');
            this.setState({ visibleMaAdd: false });
          } else {
            message.error('主机加入集群失败');
          }
        })
      } else {
        message.error('请输入合法的IP地址')
      }
    } else {
      message.error('请输入IP')
    }
  }

  openContainer = (record) => {
    this.setState({ containerVisible: true, containerName: record.nodeName })
  }

  arraySort = (array, sourcePosition, targetPosition) => {
    const sortNode = array[sourcePosition];
    array.splice(sourcePosition, 1);
    if (targetPosition === 0) array.unshift(sortNode);
    else if (sourcePosition > targetPosition) {
      array.splice(targetPosition, 0, sortNode);
    } else if (sourcePosition < targetPosition) {
      array.splice(targetPosition, 0, sortNode);
    }
  }

  onClick = (e, cluster, index) => {
    if (e.key === 'type') {
      //如果是修改类型，则先判断集群是否是私有集群
      if (cluster.public) {//公共的则打开模态框下拉选择租户
        this.setState({ clusterVisible: true, clusterId: cluster.id })

      } else {
        //打开确认框，将集群的租户信息删除，将public=true
        Modal.confirm({
          title: '是否更改为公共集群',
          content: `是否将租户${cluster.name}更改为公共集群`,
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            //调用修改租户详情接口
            editClusterType(cluster.id, { publicFlag: true }).then(data => {
              message.success('修改服务器类型成功！')
              this.props.initDatas();
            })
          }
        });
      }
    }
    if (e.key === 'up') {
      if (index === 0) {
        message.info('当前服务器所在位置已经在最顶部！')
      } else {
        let ary = [];
        ary = this.state.clusterData;
        this.arraySort(ary, index, index - 1);
        this.setState({ clusterData: [...ary] });
        reorderClusters(ary.map(n => n.id)).then(data => {
          message.success('服务器顺序修改成功！')
        })
      }
    }
    if (e.key === 'down') {
      if (index === this.state.clusterData.length) {
        message.info('当前服务器已在最底部！')
      } else {
        let ary = [];
        ary = this.state.clusterData;
        this.arraySort(ary, index, index + 1);
        reorderClusters(ary.map(n => n.id)).then(data => {
          message.success('服务器顺序修改成功！')
        })
      }
    }
    if (e.key === 'delete') {
      //打开确认框
      Modal.confirm({
        title: `是否删除服务器组`,
        content: `是否将服务器组【${cluster.name}】删除`,
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
          deleteCluster(cluster.id).then(data => {
            this.props.initDatas();
            message.success('删除成功！')
          })
        }
      });
    }
  }

  onOk = () => {
    //拿到租户调用修改接口
    let queryParams = {
      publicFlag: false,
      tenan: this.state.tenant,
    }
    editClusterType(this.state.clusterId, queryParams).then(data => {
      message.success('修改服务器类型成功！')
      this.setState({ clusterVisible: false }, () => {
        this.props.initDatas();
      })
    })
  }

  onCancel = () => {
    this.setState({
      clusterVisible: false
    })
  }

  clusterDetail = (cluster) => {
    const { history } = this.props;
    history.push({ pathname: `/setting/cluster/${cluster.id}` })
  }

  onSelect = (key) => {
    this.setState({ tenant: key })
  }

  initPropsDatas = () => {
    this.props.initDatas();
  }
  render() {
    // const extra = (
    //     <div className="imgContainer">
    //       <img style={{ width: 120 }} alt="服务器" src={constants.PIC.pc} />
    //     </div>
    //   );
    const clusterTitle = (cluster) => {
      return (
        <div className='cluster-info-title'>
          <a onClick={() => this.clusterDetail(cluster)}>{cluster.name}</a><span>类型：{cluster.public ? '共享' : '租户私有'}</span>
          <span>容器数：{cluster.containers}</span>
          <span>创建时间：{moment(cluster.createTime).format('YYYY-MM-DD')}</span>
        </div>
      )
    }


    let menu = (cluster, index) => {
      return (
        <Menu onClick={(e) => this.onClick(e, cluster, index)}>
          <Menu.Item key='type'>修改类型</Menu.Item>
          <Menu.Item key='up'>上移</Menu.Item>
          <Menu.Item key='down'>下移</Menu.Item>
          <Menu.Item key='delete'>删除</Menu.Item>
        </Menu>
      )
    }

    let clusterExtra = (cluster, index) => {
      return (
        this.props.opType !== 'look' ? <Dropdown overlay={menu(cluster, index)}>
          <Icon type="ellipsis" />
        </Dropdown> : ''
      )
    }
   
    return (
      <div>
        {this.props.opType !== 'look' ? <Button type="dashed" icon='plus' onClick={() => this.setState({ visibleAdd: true })} block style={{ margin: '20px 0 -10px 0' }}>新增服务器组</Button> : ''}
        {
          this.state.clusterData && this.state.clusterData.length > 0 ?
          this.state.clusterData.map((cluster, index) => (
            <Card loading={this.props.loading} title={clusterTitle(cluster)} extra={clusterExtra(cluster, index)} style={{ marginTop: 24 }} bordered={false}>
              {this.props.opType !== 'look' ? <Button type="primary" style={{ marginBottom: 10 }} onClick={() => this.setState({ visibleMaAdd: true })}>添加服务器</Button> : ''}
              {/* <Table columns={columns} dataSource={cluster.nodeDetailList ? cluster.nodeDetailList : cluster.nodeList} pagination={false}></Table> */}
              <ServicesTable nodeDetailList={cluster.nodeDetailList ? cluster.nodeDetailList : cluster.nodeList} {...this.props} {...this.state}/>
            </Card>
          ))
          :
          <Card style={{ marginTop:24, minHeight: 250 }} loading={this.props.loading}>
            <div style={{color:'#d4d4d4',textAlign:'center',fontSize:16,marginTop:48}}>暂无数据</div>
          </Card>
        }
        {/* <GrafanaModal visible={this.state.grafanaNodeVisible} title="节点资源监控" onCancel={e => { this.setState({ grafanaNodeVisible: false }) }} url={base.configs.globalResourceMonitUrl + constants.GRAFANA_URL.node + '&var-node=' + this.state.ip} /> */}
        <ClusterDocModal masterIP={this.state.masterIP} token={this.state.token} handleBtnAdd={this.handleBtnAdd} onCancel={() => this.setState({ visibleMaAdd: false })} visibleMaAdd={this.state.visibleMaAdd} />
        {/* <ContainerNode visible={this.state.containerVisible} onCancel={() => this.setState({ containerVisible: false })} containerName={this.state.containerName} /> */}
        <Modal
          title='更改集群类型'
          visible={this.state.clusterVisible}
          onOk={this.onOk}
          onCancel={this.onCancel}
        >
          <Select style={{ width: 200 }} onSelect={this.onSelect}>

            {this.props.tenants.map(i => {
              return <Option key={i.tenant_code} value={i.tenant_code}>{i.name}</Option>
            })}
          </Select>

        </Modal>
        <AddCluster visibleAdd={this.state.visibleAdd} onCancel={() => this.setState({ visibleAdd: false })} initDatas={this.initPropsDatas} />
      </div>
    )


  }

}