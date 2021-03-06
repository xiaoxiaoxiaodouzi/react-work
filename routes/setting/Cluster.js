import React, { Component } from 'react'
import { Card, List, Button, Icon, Modal, Input, message, Table, Popconfirm, Row, Col, Checkbox } from 'antd'
import './index.less'
import { getClusters, addCluster, deleteCluster, getClusterInfo, getNodes, deleteNodes, addHosts } from '../../services/cce';
import { base } from '../../services/base';
import constants from '../../services/constants'
import PageHeaderLayout from './layouts/PageHeaderLayout'
import { GlobalHeaderContext } from '../../context/GlobalHeaderContext'
import { BreadcrumbTitle, ClusterDocModal } from '../../common/SimpleComponents'
import './Cluster.css'
import Authorized from '../../common/Authorized';
import { GrafanaModal } from '../../common/SimpleComponents'


class Cluster extends Component {
  state = {
    datas: [],
    loading: false,
    name: '',       //集群的名字
    visibleAdd: false,       //添加集群的模态框
    visibleDel: false,
    id: '',        //集群的id
    key: '',       //集群的标识
    visibleList: false,        //主机列表Modal
    listDatas: [],
    visibleMaAdd: false,         //添加主机模态框
    ip: '{主机ip}',            // 主机ip
    masterIP: '',     //masterIP
    token: '',       //cluster_token
    showPublicCluster: false,
    isPublicCluster: false,
    grafanaVisible: false,//集群监控模态框显示
  }

  componentDidMount() {
    this.initDatas();
  }
  componentWillUpdate(nextProps) {
    if (this.props.tenant !== nextProps.tenant) {
      this.initDatas();
    }
  }

  initDatas = () => {
    let config = base.configs;

    //判断当前租户是否是管理租户
    if (config.manageTenantCode === base.tenant) {
      //是管理租户
      this.setState({
        showPublicCluster: true
      })
    } else {
      this.setState({
        showPublicCluster: false
      })
    }

    getClusterInfo().then(data => {
      if (data) {
        this.setState({
          ...data
        })
      }
    })
    getClusters().then(data => {
      if (data) {
        data.push({ new: true })
      }
      this.setState({
        datas: data,
        id: '',
        name: '',
        key: ''
      })
    })
  }

  handleChange = (e) => {
    this.setState({ name: e.target.value })
  }

  showModal = () => {
    this.setState({ visibleAdd: true, isPublicCluster: false })
  }

  handleOk = () => {
    let bodyParams = {
      name: this.state.name
    }
    if (this.state.isPublicCluster) {
      bodyParams.isPublic = true
    }
    if (this.state.name) {
      addCluster(bodyParams).then(data => {
        if (data) {
          this.initDatas();
          this.setState({ visibleAdd: false })
          message.success('新建集群成功')
        }
      })
    } else {
      message.error('请输入集群名称')
    }
  }

  handleCancle = () => {
    this.setState({
      visibleAdd: false,
      id: '',
      name: '',
      key: ''
    })
  }
  //点击删除集群
  handleDelete = (e, item) => {
    if (item.containers > 0) {
      message.info('集群【' + item.name + '】下存在容器，不能被删除！');
    } else {
      this.setState({
        id: item.id,
        name: item.name,
        visibleDel: true,
      })
    }

  }
  //点击删除集群模态框的确认
  onOk = () => {
    let id = this.state.id;
    let key = this.state.key;
    if (key.trim() === id) {
      deleteCluster(id).then(data => {
        if (data) {
          this.initDatas();
          this.setState({
            visibleDel: false
          })
          message.success('删除集群成功')
        }
      })
    } else {
      message.error('请输入正确的集群标识')
    }

  }

  //点击删除集群模态框取消
  onCancel = () => {
    this.setState({
      visibleDel: false,
      id: '',
      name: '',
      key: ''
    })
  }
  //删除时输入框的值变化
  confirmInput = (e) => {
    let key = e.target.value;
    this.setState({
      key: key
    })
  }

  //点击卡片查主机列表
  handleClick = (e, item) => {
    this.setState({
      id: item.id
    })
    getNodes(item.id, item.tenant).then(data => {
      this.setState({
        listDatas: data,
        visibleList: true,
      })
    })
  }

  //主机列表取消
  handleListCancle = () => {
    this.setState({
      visibleList: false
    })
  }

  //主机删除

  handleListDelete = (e, name) => {
    let id = this.state.id;
    deleteNodes(id, name).then(data => {
      if (data) {
        getNodes(id).then(data => {
          this.setState({
            listDatas: data,
          })
        })
        message.success('移除成功')
      }
    })
  }


  //添加主机按钮取消
  handelAddCancle = () => {
    this.initDatas();
    this.setState({
      visibleMaAdd: false,
      id: '',
      ip: '{主机ip}'
    })
  }

  //点击添加主机按钮
  handleAddClick = (e, item) => {
    this.setState({ id: item.id })
    this.setState({
      visibleMaAdd: true
    })
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
  render() {
    const columns = [
      {
        title: 'IP',
        dataIndex: 'ip',
        width: '15%'
      },
      {
        title: '主机名',
        dataIndex: 'name',
        widthL: '18%'
      },
      {
        title: 'CPU核数',
        dataIndex: 'totalCPU',
        width: '7%'
      },
      {
        title: '内存',
        dataIndex: 'totalMemory',
        width: '10%'
      },
      {
        title: '状态',
        dataIndex: 'currentStatus',
        width: '7%',
        render: (text, record) => {
          if (record.currentStatus === 'Ready') {
            return '正常'
          }
          return text;
        }
      },
      {
        title: 'Docker版本',
        dataIndex: 'containerRuntimeVersion',
        width: '13%',
        render: (text, record) => {
          return record.nodeInfo.containerRuntimeVersion.replace('docker://', '')
        }
      },
      {
        title: '加入时间',
        dataIndex: 'createTime',
        width: '20%'
      },
      {
        title: '操作',
        width: '10%',
        render: (text, record) => {
          if (this.props.public) {
            return '无'
          } else {
            return (
              <Authorized authority='cluster_deleteHost' noMatch={<a disabled='true'>移除</a>}>
                <Popconfirm title='确认删除？' onConfirm={e => this.handleListDelete(e, record.name)}>
                  <a>移除</a>
                </Popconfirm>
              </Authorized>
            )
          }
        }
      }
    ]
    const content = (
      <div className='pageHeaderContent'>
        <p>管理应用管理平台可使用的集群和主机资源</p>
        <div className='contentLink'>
          <a >
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" /> 集群主机初始化文档
          </a>
        </div>
      </div>
    )

    let breadcrumTitle = BreadcrumbTitle([{ name: '平台管理' }, { name: '集群管理' }]);
    // <Breadcrumb style={{marginTop:6}}>
    //   <Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a",verticalAlign:"text-bottom"}}/>
    //   <Breadcrumb.Item >平台管理</Breadcrumb.Item>
    //   <Breadcrumb.Item >集群管理</Breadcrumb.Item>
    // </Breadcrumb>;

    return (
      <PageHeaderLayout
        title={breadcrumTitle}
        content={content}
      >
        <div className='cardList'>
          <List
            rowKey="id"
            loading={this.state.loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={this.state.datas}
            renderItem={(item, i) => (!item.new ?
              <List.Item key={item.id}>
                <Card className='card' actions={item.public ? (this.state.showPublicCluster ? [<Authorized authority={'cluster_addHost'} noMatch={<a disabled='true' onClick={e => this.handleAddClick(e, item)}>新增主机</a>}><a onClick={e => this.handleAddClick(e, item)}>新增主机</a></Authorized>, <Authorized authority={'cluster_delete'} noMatch={<a disabled='true' onClick={e => this.handleDelete(e, item)}>删除集群</a>}><a onClick={e => this.handleDelete(e, item)}>删除集群</a></Authorized>] : ['']) : [<Authorized authority={'cluster_addHost'} noMatch={<a disabled='true' onClick={e => this.handleAddClick(e, item)}>新增主机</a>}><a onClick={e => this.handleAddClick(e, item)}>新增主机</a></Authorized>, <Authorized authority={'cluster_delete'} noMatch={<a disabled='true' onClick={e => this.handleDelete(e, item)}>删除集群</a>}> <a onClick={e => this.handleDelete(e, item)}>删除集群</a></Authorized>]}>
                  <Card.Meta
                    //avatar={<img alt="" className='cardAvatar' src={item.avatar} />}
                    title={base.configs.monitEnabled ? <a onClick={e => { this.setState({ grafanaVisible: true, clusterId: item.id }) }}>{item.public ? '公共集群-' + item.name : '私有集群-' + item.name}</a> : <span>{item.public ? '公共集群-' + item.name : '私有集群-' + item.name}</span>}
                    description={
                      <div>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginBottom: 5 }}>
                          <Col md={8} sm={24}>
                            <span>主机数</span>
                          </Col>
                          <Col md={8} sm={24}>
                            <span>容器数</span>
                          </Col>
                        </Row>
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                          <Col md={8} sm={24} style={{ marginLeft: 10 }}>
                            <h2 onClick={e => this.handleClick(e, item)}>{item.nodes}</h2>
                          </Col>
                          <Col md={8} sm={24}>
                            <h2>{item.containers}</h2>
                          </Col>
                        </Row>
                        {/*<Row><p>资源平均水位：17.1%     <span style={{marginLeft:20}}>状态:健康</span> </p></Row> */}
                      </div>
                    }
                  />
                </Card>
              </List.Item> :
              <List.Item>
                <Authorized authority={'cluster_add'} noMatch={null}>
                  <Card>
                    <Button type="dashed" className='newButton' onClick={this.showModal} style={{ height: '155px' }}>
                      <Icon type="plus" /> 新增集群
                        </Button>
                  </Card>
                </Authorized>
              </List.Item>


            )}
          />

          <GrafanaModal visible={this.state.grafanaVisible} title='集群监控' onCancel={e => { this.setState({ grafanaVisible: false }) }}
            url={base.configs.globalResourceMonitUrl + constants.GRAFANA_URL.cluster + '&var-cluster=' + this.state.clusterId} />
          <Modal
            title='新建集群'
            visible={this.state.visibleAdd}
            onOk={this.handleOk}
            onCancel={this.handleCancle}
          >
            <div style={{ marginLeft: 24 }}>
              集群名称:   <Input style={{ width: 300 }} value={this.state.name} onChange={e => this.handleChange(e)} />
            </div>
            {this.state.showPublicCluster && <div style={{ marginLeft: 24, marginTop: 24 }}>
              公共集群:   <Checkbox checked={this.state.isPublicCluster} onChange={(e) => this.setState({ isPublicCluster: e.target.checked })}></Checkbox>
            </div>}

          </Modal>

          <Modal
            title='删除集群'
            visible={this.state.visibleDel}
            onOk={this.onOk}
            footer={
              <Button type='danger' onClick={this.onOk}>确认</Button>
            }
            onCancel={this.onCancel}
          >
            <p>您要删除的集群是:{this.state.name}</p>
            <p>请注意： 删除集群时，会立刻删除集群下面所有部署的应用、存储卷、数据等所有资源. <strong>此操作影响很大，且不能够恢复 ，请慎重操作!</strong> </p>
            <p>如果确认要删除此集群的话， 请在下方输入集群完整的标识！</p>
            <p>集群标识:  {this.state.id}</p>
            <Input placeholder='请输入集群标识' value={this.state.key} onChange={e => this.confirmInput(e)} />
          </Modal>

          <Modal
            width='1100px'
            title='主机列表'
            visible={this.state.visibleList}
            onCancel={this.handleListCancle}
            footer={null}
          >
            <Table
              rowKey={record => record.key}
              columns={columns}
              dataSource={this.state.listDatas}
            />
          </Modal>
          <ClusterDocModal masterIP={'this.state.masterIP'} token={'this.state.token'} handleBtnAdd={this.handleBtnAdd} onCancel={() => this.setState({ visibleMaAdd: false })} visibleMaAdd={this.state.visibleMaAdd} />
        </div>
      </PageHeaderLayout>
    )
  }
}

export default props => (
  <GlobalHeaderContext.Consumer>
    {context => <Cluster {...props} tenant={context.tenant} />}
  </GlobalHeaderContext.Consumer>
);
