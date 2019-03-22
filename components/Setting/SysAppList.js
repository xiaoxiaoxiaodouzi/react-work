import React, { Component } from 'react';
import { List, Skeleton, Avatar, Row, Col, Icon, Modal, message } from "antd";
import { getCorecomponents, deployCorecomponents, componentStatus, getClusterList, deleteComponent, componentContent, getNodeList } from '../../services/cce';
import { DynamicFormEditor } from 'c2-antd-plus';
import constants from '../../services/constants';
import '../Application/Log/LogHeader.css'
import { base } from '../../services/base';
import styled from 'styled-components';
import { queryEnvById } from '../../services/amp';

//平台组件code
const engineAppCodes = ['amp', 'cce', 'apigateway', 'harbor', 'monitor', 'log', 'apm'];
//环境组件code
const environmentAppCodes = ['ams', 'apigateway', 'route'];
//这里为调整item-action的样式
const ListStyled = styled(List)`
.ant-list-item-action{
  width: 100px;
  text-align: center ;
}
`

export default class SysAppList extends Component {

  state = {
    loading: false,
    datas: null,
    name: '',
    visible: false,
    items: [],
    clusterDatas: [],
    statusVisible: false,
    buttonLoadin: false,
    reloadLoading: false,
    nodeOptions: [],
    masterOptions: [],
    intervals: [],
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.envId && this.props.envId !== prevProps.envId) {
      this.loadData();
    }
  }

  handleComponnetChange = (name) => {
    getClusterList().then(datas => {
      getNodeList().then(nodeData => {
        let nodeOptions = [];
        let masterOptions = [];
        if (nodeData.node) {
          nodeData.node.forEach(i => {
            nodeOptions.push({ label: i, value: i })
          })
        }
        if (nodeData.master) {
          nodeData.master.forEach(i => {
            masterOptions.push({ label: i, value: i })
          })
        }
        this.setState({ nodeOptions, masterOptions, clusterDatas: datas }, () => {
          let items = this.ModalItems(name) || [];
          let clusterOptions = [];
          let clusterDatas = datas;
          clusterDatas.forEach(i => {
            clusterOptions.push({ label: i.name, value: i.id })
          })
          items.push({ label: '所属集群', name: 'cluster', type: 'select', options: clusterOptions, required: true, requiredMessage: '请选择集群' });
          let contentOptions = [];
          //查询chart版本
          componentContent(name, { env: this.props.envId }).then(data => {
            if (data) {
              data.forEach(i => {
                contentOptions.push({ label: i.version, value: i.urls[0] })
              })
              items.push({ label: 'chart版本', name: 'charturl', type: 'select', options: contentOptions, required: true, requiredMessage: '请选择chart版本' })
            }
            this.setState({ name: name, visible: true, items: items, resources: null })
          })
        })
      })
    })
  }

  deleteComponent = (name) => {
    this.setState({ loading: true })
    deleteComponent(name, { env: this.props.envId }).then(data => {
      this.loadData();
      this.setState({ loading: false })
    }).catch(err => {
      this.setState({ loading: false })
    })
  }

  onOk = (err, values) => {
    if (err) return;
    let name = this.state.name;
    let params = {
      namespace: base.configs.manageTenantCode,
      charturl: values.charturl,
      'global.cluster': values.cluster
    };
    if (name === 'monitor') {
      params = Object.assign({
        'global.registry': /* constants.DEFAULT_URL.harbor */'registry.c2cloud.cn',
        'global.appNode': values.appNode,
        'global.masterNode': values.masterNode,
      }, params)
    } else if (name === 'apm') {
      params = Object.assign({
        'global.registry': /* constants.DEFAULT_URL.harbor */'registry.c2cloud.cn',
        'hbase.nodeName': values.nodename,
      }, params)
    } else if (name === 'log') {
      params = Object.assign({
        'global.registry': /* constants.DEFAULT_URL.harbor */'registry.c2cloud.cn',
        "log.esClusterNode": constants.CHART_DEPLOYMENT.logEsClusterNode,
        'log.nodePort': constants.CHART_DEPLOYMENT.logNodePort,
        'filebeat.config.output.elasticsearch.hosts': constants.CHART_DEPLOYMENT.filebeatConfigOutputElasticsearchHosts,
        'elasticsearch.nodeName': values.nodename,
      }, params)
    }
    if (values) {
      deployCorecomponents(name, { env: this.props.envId }, params).then((datas) => {
        if (datas) {
          message.success('部署成功！')
          this.statusReload();
        } else {
          message.error('部署失败，请联系管理员！')
        }
        this.loadData();
      })
    }
  }

  loadData = () => {
    this.setState({ loading: true, buttonLoadin: true })
    if (this.props.envId === 'cep') {
      getCorecomponents({ env: 'cep', name: engineAppCodes }).then(data => {
        this.setState({ datas: data, loading: false, buttonLoadin: false })
      }).catch(err => {
        this.setState({ loading: false })
      })
    } else {
      queryEnvById(this.props.envId).then(env => {
        getCorecomponents({ env: env.code, name: environmentAppCodes }).then(data => {
          this.setState({ datas: data, loading: false, buttonLoadin: false })
        }).catch(err => {
          this.setState({ loading: false })
        })
      })
    }
  }

  ModalItems = (name) => {
    if (name === 'apm') {
      return [
        //这里的name不能叫做nodeName，因为跟他自己的属性冲突了，所以会报错
        { label: 'hbase部署所在节点', name: 'nodename', required: true, requiredMessage: '请填写部署节点' },
      ]
    } else if (name === 'monitor') {
      return [
        { label: 'k8s环境监控应用节点', name: 'appNode', required: true, type: 'select', options: this.state.nodeOptions, requiredMessage: '请填写监控应用节点' },
        { label: 'k8s环境主节点', name: 'masterNode', required: true, type: 'select', options: this.state.masterOptions, requiredMessage: '请填写环境节点' },
      ]
    } else if (name === 'log') {
      return [
        { label: 'elasticSearch安装的node名称', name: 'nodename', required: true, type: 'select', options: this.state.nodeOptions, requiredMessage: '请填写elasticSearch节点' },
      ]
    }
  }

  reload = () => {
    this.loadData()
  }

  statusReload = () => {
    this.setState({ resources: '数据加载中...' })
    let interval = setInterval(() => {
      componentStatus(this.state.name, { env: this.props.envId }).then(data => {
        if (data && data.RESOURCES) {
          this.setState({ resources: data.RESOURCES })
        } else {
          this.setState({ resources: '暂无数据，请联系管理员' })
        }
      })
    }, 5000
    )
    this.state.intervals.push(interval);
  }

  chartDetail = (item) => {
    const { history } = this.props;
    queryEnvById(this.props.envId==='cep'?'1':this.props.envId).then(data => {
      if (data) {
        base.currentEnvironment = data;
        base.environment = data.id;
      }
    })
    history.push({ pathname: `/setting/systemsetting/env/${this.props.envId}/apps/${item.name}` })
  }

  chartStatus = (item) => {
    this.setState({ visible: true, name: item.name })
    this.statusReload();
  }

  onCancel = () => {
    this.state.intervals.forEach(item => {
      clearInterval(item)
    })
    this.setState({ visible: false })
  }
  render() {
    const { name, items, loading, datas, visible, resources } = this.state;
    let bodyStyle =
      { heigth: '550px', padding: resources ? 0 : null }

    const actions = (item) => {
      if (item.name === 'amp' || item.name === 'cce' || item.name === 'apigateway' || item.name === 'ams' || item.name === 'route') {
        return [<a onClick={() => this.chartDetail(item)}>管理</a>]
      } else if (item.health === 'unkonwn') {
        return [<a onClick={() => {
          this.handleComponnetChange(item.name);
        }}>一键部署</a>]
      } else {
        return [
          <a onClick={() => this.chartDetail(item)}>管理</a>,
          // <a onClick={() => { this.deleteComponent(item.name) }}>删除</a>
        ]
      }
    }
    // let footer = resources ? [<Button type='primary' icon='reload' onClick={this.statusReload} loading={reloadLoading}>刷新</Button>] : null
    return (
      <div>
        {/* <Button type='primary' icon='reload' style={{ magin: '24px 0' }} onClick={this.reload} loading={buttonLoadin}>刷新</Button> */}
        <ListStyled
          locale='暂无数据'
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          dataSource={datas || []}
          renderItem={item => {
            return (
              <List.Item actions={actions(item)}>
                <Skeleton avatar title={false} loading={item.loading} active>
                  <List.Item.Meta
                    avatar={<Avatar src={constants.PIC.app} />}
                    title={item.showName}
                    description={item.description}
                  />
                  <div style={{ width: '250px' }}>
                    <Row>
                      <Col span={12}>
                        状态:
                    </Col>
                      <Col span={12}>
                        版本:
                    </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <span style={{ cursor: 'pointer' }} onClick={e => { this.chartStatus(item) }}>
                          <Icon type="check-circle" style={{ color: item.lightColor }} />{item.healthDesc}
                        </span>
                      </Col>
                      <Col span={12}>
                        {item.version}
                      </Col>
                    </Row>
                  </div>
                </Skeleton>
              </List.Item>
            )
          }}
        />

        <Modal
          bodyStyle={bodyStyle}
          title={resources ? `查看${name}部署状态` : `一键部署${name}`}
          footer={null}
          visible={visible}
          onCancel={this.onCancel}
          width={constants.MODAL_STYLE.DEFAULT_WIDTH}
          destroyOnClose
          maskClosable
        >
          {resources ? <div><pre className="logs" style={{ height: '500px', overflow: 'auto' }}>{this.state.resources}</pre> </div> : <DynamicFormEditor style={{ marginTop: 24 }} items={items} title={`${name}部署`} name={name} envId={this.props.envId} onSubmit={this.onOk} labelSpan={7} wrapperSpan={12} />}
        </Modal>
      </div>
    )
  }
}