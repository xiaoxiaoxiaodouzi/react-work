import React, { Component } from 'react'
import { Card, Alert, Button, message, Switch, Modal, Input, Checkbox, Tooltip, InputNumber} from 'antd';
import constants from '../../services/constants'
import { deleteApp, delServerGroup, updateApp, getAppByMiddleware, getAppManager, changeAppManager, changeAppProperty } from '../../services/aip'
import { addAppEnvs, deleteAppEnvs, changeAppCluster, changeAppExtention } from '../../services/cce'
import { appStart, queryBaseConfig, deleteVolumes, existEnvs, editEnvs, deleteAppDeploy, queryAppVolumns } from '../../services/cce'
import { base } from '../../services/base'
import Authorized from '../../common/Authorized';
import { deleteRouters, getRouters, deleteUpstream, queryEnvById, getConfigs } from '../../services/amp'
import { ErrorComponentCatch } from '../../common/SimpleComponents';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import Description from 'ant-design-pro/lib/DescriptionList/Description';
import UserSelectModal from '../../common/UserSelectModal';
import InputInline from '../../common/Input';
import ClusterSelectModal from '../../common/ClusterSelectModal';

class AppSetting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',      //应用名称
      host: '',
      ctx: '',
      visible: false,
      checked: '',
      APMChecked: false,            //APM地址是否开启
      APM_URL: '',     //APM地址
      config: '',       //环境code_应用code
      visibleDel: false,    //删除应用模态框
      isK8s: true,         //应用部署方式是否为K8S
      appDatas: {},  //应用数据
      hasVolumes: false,     //是否有存储卷
      isDeleteVolumes: false,
      springCloud: false,     //是否开启springcloud
      eurekaServerUrls: '',        //注册中心地址
      type: '',
      appNames: '',
      systemManager: [],
      clusterVisible: false,
      isEditNumber: false,
      replicas: '',
      description: ''
    }
    this.onAppDescriptionChangeCommit = this.onAppDescriptionChangeCommit.bind(this);
  }

  componentDidUpdate(props, state) {
    if (props.deployInfo && props.deployInfo.replicas !== state.replicas) {
      this.setState({ replicas: props.deployInfo.replicas })
    }
  }

  componentDidMount() {
    const { history } = this.props;
    let b = history.location.hash === '#APMchecked' ? true : false;
    if (b) {
      let anchorElement = document.getElementById('APMChecked');
      //先暂时写死，这里有两个div对象。我们要滚动的div是第二个；
      let anchorElement1 = document.getElementsByClassName('ant-layout')[1];
      if (anchorElement) {
        anchorElement1.scrollTo(0, anchorElement.offsetTop - window.innerHeight / 2);
      }
    }
    let code = this.props.appCode;
    // const env = this.props.environment;
    if (base.currentEnvironment) {
      const configs = base.currentEnvironment.code + '_' + code;
      this.setState({
        config: configs,
        code: code
      })
    }
    let id = this.props.appId;
    //如果有id的话则刷新
    if (id) {
      //需要想办法 让这个方法先执行再执行下面的
      this.loadData(id);
    }
    if (base.configs.passEnabled) {
      queryAppVolumns(this.props.appCode).then(response => {
        this.volumes = response;
        this.setState({ hasVolumes: !!response.length });
      });
    }
    getAppManager(id, 'SYSTEM_MANAGER', this.props.appCode).then(data => {
      this.setState({ systemManager: data });
    })

  }

  loadData = (id) => {
    let envId = base.currentEnvironment.id;
    let data = this.props.appData;
    queryEnvById(envId).then(res => {
      this.setState({ eurekaServerUrls: res.eurekaServerUrls })
    })

    if (!base.safeMode) {
      getConfigs().then(data1 => {
        if (data1) {
          //将APM_URL地址
          if (data1[constants.CONFIG_KEY.APM_URL]) {
            this.setState({
              APM_URL: data1[constants.CONFIG_KEY.APM_URL].split(":")[0],
            })
          }

        }
      })
      this.setState({
        APMChecked: !!data.apm,
        name: data.name,
        appType: data.type,
        appDatas: data,
        host: data.host,
        ctx: data.ctx,
        description: data.desc,
        type: data.type === 'middleware' ? '中间件' : '应用',
        springCloud: data.springcloud ? true : false,
        isK8s: data.deployMode === 'k8s' ? true : false
      })
      //如果应用的部署方式是K8S才去调CCE接口
      if (data.type === 'middleware') {
        getAppByMiddleware(id).then(data => {
          let appNames = [];
          data.forEach(element => {
            appNames.push(element.name)
          })
          this.setState({ appNames: appNames.join(',') })
        })
      }
    }
  }


  //删除应用
  handleDelete = () => {
    this.setState({ deleteLoading: true });
    const appid = this.props.appId;
    const appCode = this.props.appCode;
    const isK8s = this.state.isK8s;
    if (isK8s && base.configs.passEnabled) {
      deleteAppDeploy(appCode).then(data => {
        this.deleteRouters(appid);
      }).catch(e => {
        base.ampMessage("删除应用部署失败");
      });
    } else {
      this.deleteRouters(appid);
    }
  }

  showModal = () => {
    this.setState({
      key: '',
      visibleDel: true
    })
  }

  //删除时输入框的值变化
  confirmInput = (e) => {
    let key = e.target.value;
    this.setState({
      key: key
    })
  }

  handleCancel = () => {
    this.setState({
      visibleDel: false,
    })
  }

  handleOk = () => {
    let key = this.state.key;
    let code = this.props.appCode;
    if (key.trim() === code) {
      this.handleDelete();
    } else {
      message.error(`请输入正确的${this.state.type}CODE`)
    }
  }

  _onManagerChange(type, users) {
    var usersId = [];
    users.forEach((element) => {
      usersId.push(element.id);
    })
    changeAppManager(this.props.appData.id, type, usersId)
      .then((response) => {
        message.success('管理员修改成功！')
        if (type === "SYSTEM_MANAGER") {
          this.setState({
            systemManager: users
          })
        } else if (type === "BUSINESS_MANAGER") {
          this.setState({
            businessManager: users
          })
        } else if (type === 'AUDIT_MANAGER') {
          this.setState({
            auditManager: users
          })
        }
      })
      .catch((e) => {
      })
  }

  clusterOnOk = (cluster, clusterName, th) => {
    if (cluster) {
      changeAppCluster(this.props.appData.code, cluster).then(data => {
        if (data) {
          message.success("应用迁移成功！");
          this.setState({
            clusterVisible: false,
            clusterName: clusterName,
            clusterId: cluster
          });

          th.setState({
            loading: false
          });
        }
      }).catch(err => {
        th.setState({
          loading: false
        });
      });
    } else {
      message.error("请选择集群！");
    }
  }

  clusterOnCancel = () => {
    this.setState({
      clusterVisible: false
    })
  }

  _clusterVisible = () => {
    this.setState({
      clusterVisible: true
    });
  }

  //删除域名
  deleteRouters = (appid) => {
    if (base.currentEnvironment.routerSwitch) {
      //先删除域名
      getRouters(this.state.code).then(datas => {
        let allDoms = [];
        if (datas) {
          datas.forEach(data => {
            allDoms.push(deleteRouters(data.id));
          });
        }
        if (allDoms.length > 0) {
          Promise.all(allDoms).then(res => {
            this.deleteApp(appid);
          })
        } else {
          this.deleteApp(appid);
        }
      })
    } else {
      this.deleteApp(appid);
    }
  }

  deleteApp = (appid) => {
    if (this.state.isDeleteVolumes && base.configs.passEnabled) {
      //勾选删除存储卷
      this.volumes.forEach(element => {
        deleteVolumes(element.name)
      })
    }
    deleteApp(appid).then(data => {
      if (this.state.isK8s && this.state.appType === 'apps') {
        delServerGroup(appid);
      }
      deleteUpstream(this.state.code).then(res => {
        this.setState({ deleteLoading: false });
        message.success(`删除${this.state.type}成功`)
        if (this.state.appType === 'middleware') {
          window.location.href = '/#/middlewares';
        } else {
          window.location.href = '/#/apps';
        }
      })
    }).catch(e => {
      base.ampMessage(`删除${this.state.type}失败`);
      this.setState({ deleteLoading: false });
    });
  }

  _handleClick = () => {
    this.setState({
      visible: true,
    })
  }

  _handleCancle = () => {
    this.setState({
      visible: false
    })
  }


  _handleOk = (restart) => {
    let code = this.props.appCode;
    let checked = this.state.APMChecked;
    if (this.state.isK8s && base.configs.passEnabled) {
      const configs = this.state.config;
      let APM_URL = this.state.APM_URL;
      let ary = [
        {
          key: constants.APMENABLE_KEY[0],
          value: APM_URL,
          source: 1,
          desc: '性能监控地址',
        },
        {
          key: constants.APMENABLE_KEY[1],
          value: configs,
          source: 1,
          desc: '开启监控用到的应用名'
        },
      ];
      let bodyParams = {};
      //如果是的开启状态，则把APM对应的环境变量删除
      queryBaseConfig(code).then(data => {
        let pro = [];
        let pros = [];
        let containers = [];//用于将容器名存储以便后面做新增接口调用
        if (data) {
          data.forEach(item => {
            pros.push(existEnvs(code, item.name, constants.APMENABLE_KEY[1]));
            pros.push(existEnvs(code, item.name, constants.APMENABLE_KEY[0]));
            containers.push(item.name);
          })
          Promise.all(pros).then(response => {
            if (response) {
              response.forEach((item, i) => {
                //先判断是否是开启状态，然后调查询接口，如果存在则调删除（修改）接口，否则不处理（新增接口）；
                if (checked) {
                  //将应用APM改为false
                  bodyParams.apm = false;
                  if (item) {
                    pro.push(deleteAppEnvs(code, item.name, item.id))
                  }
                } else {
                  bodyParams.apm = true;
                  //如果是关闭状态，先判断该环境变量key存不存在，有的话
                  if (item) {
                    if (item.key === constants.APMENABLE_KEY[0]) {
                      pro.push(editEnvs(code, item.containerName, {
                        key: constants.APMENABLE_KEY[0],
                        value: APM_URL
                      }, item.id));
                    }
                    if (item.key === constants.APMENABLE_KEY[1]) {
                      pro.push(editEnvs(code, item.containerName, {
                        key: constants.APMENABLE_KEY[1],
                        value: configs,
                      }, item.id));
                    }
                  } else {
                    //遍历所有的容器名，然后调新增接口
                    containers.forEach(items => {
                      if (ary[i]) {
                        pro.push(addAppEnvs(code, items, ary[i]))
                      }

                    })
                  }
                }
              });
              //当有存在的key才去调接口
              Promise.all(pro).then(res => {
                this.setState({
                  APMChecked: !checked,
                })
                message.success('环境变量更改成功！')
                let queryParams = {
                  type: '2'
                }
                updateApp(this.state.appDatas.id, queryParams, bodyParams).then(data => {
                  if (restart) {
                    appStart(code).then(data => {
                      message.success(`${this.state.type}重启成功！`);
                    })
                  } else {
                    message.success(`修改${this.state.type}成功`)
                  }
                })
                /* appStart(code).then(data=>{
                }) */
              }).catch((e) => {
                base.ampMessage('环境变量操作失败')
              })
              this.setState({
                visible: false
              })
            }
          }).catch((e) => {
            base.ampMessage('查询环境变量存在出错')
          })
        }
      })
    } else {
      updateApp(this.state.appDatas.id, {}, { apm: checked ? false : true }).then(data => {
        message.success('开启性能监控成功！')
        this.setState({
          visible: false,
          APMChecked: !checked,
        })
      })
    }
  }

  //开启关闭springcloud，新增环境变量
  handleSpringCloud = () => {
    let code = this.props.appCode;
    let envId = base.currentEnvironment.id;
    queryEnvById(envId).then(res => {
      let params = [{
        key: constants.SPRING_CLOUD_KEY[0],
        value: code,
        source: '1',
        desc: '应用CODE(启用SpringCloud特性支持)'
      }, {
        key: constants.SPRING_CLOUD_KEY[1],
        value: res.eurekaServerUrls,
        source: '1',
        desc: '注册中心地址(启用SpringCloud特性支持)'
      }]
      this.setState({ eurekaServerUrls: res.eurekaServerUrls })
      if (base.configs.passEnabled) {
        queryBaseConfig(code).then(data => {
          let pro = [];
          let pros = [];
          let containers = [];//用于将容器名存储以便后面做新增接口调用

          if (data.length > 0) {
            data.forEach(item => {
              //先调查询接口，如果数据存在，则调删除接口，否则不处理
              pros.push(existEnvs(code, item.name, constants.SPRING_CLOUD_KEY[0]));
              pros.push(existEnvs(code, item.name, constants.SPRING_CLOUD_KEY[1]));
              containers.push(item.name);
            })
            Promise.all(pros).then(response => {
              response.forEach((item, i) => {
                //如果是开启状态
                if (this.state.springCloud) {
                  if (item) {
                    pro.push(deleteAppEnvs(code, item.name, item.id))
                  }
                } else {
                  //如果是关闭状态
                  if (item) {
                    //如果数据存在则修改环境变量
                    if (item.key === constants.SPRING_CLOUD_KEY[0]) {
                      pro.push(editEnvs(code, item.containerName, params[0], item.id));
                    }
                    if (item.key === constants.SPRING_CLOUD_KEY[1]) {
                      pro.push(editEnvs(code, item.containerName, params[1], item.id));
                    }
                  } else {
                    containers.forEach(items => {
                      pro.push(addAppEnvs(code, items, params[i]))
                    })
                  }
                }
              })
              //当有存在的key才去调接口
              Promise.all(pro).then(response => {
                let queryParams = {
                  type: '2'
                }
                let bodyParams = {
                  springcloud: !this.state.springCloud
                }
                this.setState({
                  springCloud: !this.state.springCloud,
                })
                message.success('环境变量更改成功！')
                updateApp(this.state.appDatas.id, queryParams, bodyParams).then(data => {
                  message.success(`修改${this.state.type}成功`)
                })
              })
            })
          }
        })
      } else {
        let queryParams = {
          type: '2'
        }
        let bodyParams = {
          springcloud: !this.state.springCloud
        }
        this.setState({
          springCloud: !this.state.springCloud,
        })
        message.success('环境变量更改成功！')
        updateApp(this.props.appId || this.state.appDatas.id, queryParams, bodyParams).then(data => {
          message.success(`修改${this.state.type}成功`)
        })
      }

    })
  }

  //第一个参数为新增的环境变量参数，第二个参数为环境变量KEY ：constants.SPRING_CLOUD_KEY,应用code
  checkEnvVar = (params, key, code) => {
    queryBaseConfig(code).then(data => {
      let pro = [];
      let pros = [];
      let containers = [];//用于将容器名存储以便后面做新增接口调用
      if (data.length > 0) {
        data.forEach(item => {
          //先调查询接口，如果数据存在，则调删除接口，否则不处理
          pros.push(existEnvs(code, item.name, key[0]));
          pros.push(existEnvs(code, item.name, key[1]));
          containers.push(item.name);
        })
        Promise.all(pros).then(response => {
          response.forEach((item, i) => {
            //如果是开启状态
            if (this.state.springCloud) {
              if (item) {
                pro.push(deleteAppEnvs(code, item.name, item.id))
              }
            } else {
              //如果是关闭状态
              if (item) {
                //如果数据存在则修改环境变量
                if (item.key === key[0]) {
                  pro.push(editEnvs(code, item.containerName, params[0], item.id));
                }
                if (item.key === key[1]) {
                  pro.push(editEnvs(code, item.containerName, params[1], item.id));
                }
              } else {
                containers.forEach(items => {
                  pro.push(addAppEnvs(code, items, params[i]))
                })
              }
            }
          })
          //当有存在的key才去调接口
          Promise.all(pro).then(response => {
            let queryParams = {
              type: '2'
            }
            let bodyParams = {
              springcloud: !this.state.springCloud
            }
            this.setState({
              springCloud: !this.state.springCloud,
            })
            message.success('环境变量更改成功！')
            updateApp(this.state.appDatas.id, queryParams, bodyParams).then(data => {
              message.success(`修改${this.state.type}成功`)
            })
          })
        })
      }
    })
  }

  _onEditHostOk = () => {
    let ctx = this.state.ctx;
    let host = this.state.host;
    if (!constants.reg.host.test(host)) {
      message.info('访问地址必须是http https://xxx.xxx.xxx格式')
      return
    }
    if (ctx && !ctx.startsWith('/')) {
      message.info('上下文必须以/开头');
      return
    }
    if ((ctx && ctx.startsWith('/')) || ctx === '') {
      updateApp(this.props.appId, {}, { host: host, ctx: ctx }).then(res => {
        message.success('修改访问地址成功！');
        this.setState({ edit: false });
      })
    }
  }

  _setReplicas = () => {
    this.setState({
      replicasLoading: true
    })
    changeAppExtention(this.state.code, this.state.replicas).then(data => {
      this.setState({
        isEditNumber: false,
        replicasLoading: false
      })
    }).catch(err => {
      this.setState({
        replicasLoading: false
      })
    })
  }

  //应用描述修改
  onAppDescriptionChangeCommit(value) {
    changeAppProperty(this.props.appId, { name: this.state.name, desc: value })
      .then((response) => {
        if (response) {
          message.success('修改描述成功！');
          this.setState({
            description: value
          })
        }
      })
  }

  render() {
    const { appDatas } = this.state;
    const { deployInfo } = this.props;
    var manager = this.state.systemManager.map(m => m.userName).join(',');
    return (
      <div>
        <Card title='基础信息' bordered={false} style={{ margin: 24 }}>
          <DescriptionList style={{ marginBottom: 16 }} col="2">
            {base.configs.passEnabled ?
              <Description term="所属集群">
                <Authorized authority={this.state.appTypeName === "中间件" ? 'middleware_migrate' : 'app_migrate'} noMatch={deployInfo.clusterName}>
                  <Tooltip title="点击迁移应用" onClick={this._clusterVisible}>{deployInfo.clusterName}</Tooltip>
                </Authorized>
              </Description> : ""
            }
            {base.configs.passEnabled ?
              <Description term="应用副本">
                {
                  this.state.isEditNumber ?
                    <div><InputNumber min={1} max={5} value={this.state.replicas} onChange={e => this.setState({ replicas: e })} />
                      <Button style={{ marginLeft: 8 }} type="primary" onClick={this._setReplicas} loading={this.state.replicasLoading}>确定</Button><Button style={{ marginLeft: 8 }} onClick={() => { this.setState({ isEditNumber: false }) }}>取消</Button></div>
                    :
                    <Authorized authority={this.state.type === "middleware" ? "middlewares_edit" : "app_edit"} noMatch={this.state.replicas}>
                      <Tooltip title="点击修改副本数" onClick={() => { if (!this.state.isEditNumber) { this.setState({ isEditNumber: true }) } }}>
                        {this.state.replicas ? this.state.replicas : '--'}
                      </Tooltip>
                    </Authorized>
                }
              </Description>
              : ""
            }

          </DescriptionList>
          <DescriptionList col={1}>
            <Description term='访问地址'>
              {this.state.edit ?
                <span>
                  <Input style={{ width: 200 }} value={this.state.host} onChange={e => { this.setState({ host: e.target.value }) }} />
                  <Input style={{ width: 100, marginLeft: 5 }} value={this.state.ctx ? this.state.ctx : '/'} onChange={e => { this.setState({ ctx: e.target.value }) }} />
                  <Button style={{ marginLeft: 3 }} type='primary' onClick={this._onEditHostOk}>确定</Button>
                  <Button style={{ marginLeft: 3 }} onClick={() => { this.setState({ edit: false }) }} >取消</Button>
                </span> :
                <Tooltip title="点击修改访问地址" onClick={() => { this.setState({ edit: true }) }}>
                  {this.state.host + this.state.ctx ? this.state.host + this.state.ctx : '--'}
                </Tooltip>
              }
            </Description>
            <Description term="系统管理员">
              <Authorized authority={this.state.appTypeName === "中间件" ? 'moddleware_managerSetting' : 'app_managerSetting'} noMatch={this.state.systemManager.length === 0 ? '未指定' : manager}>
                <UserSelectModal
                  title={'设置系统管理员'}
                  mark='系统管理员'
                  description=''
                  selectedUsers={this.state.systemManager}
                  disabledUsers={this.state.systemManager}
                  dataIndex={{ dataIdIndex: 'USERID', dataNameIndex: 'userName' }}
                  onOk={(users) => { this._onManagerChange('SYSTEM_MANAGER', users) }} />
              </Authorized>
            </Description>

            <Description>
              <InputInline title={'描述'} value={this.state.description} onChange={this.onAppDescriptionChangeCommit} dataType={'TextArea'} mode={'inline'} defaultNullValue={'空'} width={600} />
            </Description>
          </DescriptionList>
        </Card>
        {base.safeMode ? "" :
          base.configs.APMEnabled ? <Card bordered={false} style={{ margin: 24 }} title='性能监控' id='APMChecked'>
            <div style={{ marginBottom: 24 }}>
              <span>启用性能监控: </span>
              <Authorized authority={appDatas.type === 'middleware' ? 'middleware_performance' : 'app_performanceMonitor'}
                noMatch={<Switch style={{ marginLeft: 24 }} disabled={true} checked={this.state.APMChecked} />}>
                <Switch style={{ marginLeft: 24 }} checked={this.state.APMChecked} onClick={this._handleClick} />
              </Authorized>
              <p style={{ marginTop: 24 }}>  如果需要开启性能监控地址的话请联系管理员 {/* 请点击 <a onClick={this.handleClickPush}>这里</a>来修改性能监控地址 */}</p>
            </div>
          </Card> : ""}

        {base.safeMode ? "" : <Card bordered={false} style={{ margin: 24 }} title='Spring  Cloud'>
          <span>接入注册中心: </span> <Authorized authority={appDatas.type === 'middleware' ? 'middleware_springCloud' : 'app_springCloud'} noMatch={<Switch style={{ marginLeft: 24 }} checked={this.state.springCloud} onClick={this.handleSpringCloud} disabled='true' />}> <Switch style={{ marginLeft: 24 }} checked={this.state.springCloud} onClick={this.handleSpringCloud} /> </Authorized>
          {this.state.springCloud ? <p style={{ marginTop: 24 }}>注册中心地址：{this.state.eurekaServerUrls}</p> : ''}
        </Card>}

        <Card bordered={false} style={{ margin: 24 }} title={appDatas.type === 'middleware' ? '中间件删除' : '应用删除'} >
          <Alert message={`删除${this.state.type}时，${this.state.type}相关的所有资源都会被删除，此操作不能够撤销 !`} type="error" style={{ marginBottom: 10 }} />
          <Authorized authority={appDatas.type === 'middleware' ? 'middleware_delete' : 'app_delete'} noMatch={null}>
            <Button loading={this.state.deleteLoading} type='danger' size='large' icon='delete' onClick={this.showModal}>删除</Button>
          </Authorized>
        </Card>

        <Modal
          title={this.state.APMChecked ? '关闭性能监控' : '开启性能监控'}
          footer={[
            <Button key='1' onClick={this._handleCancle}>取消</Button>,
            <Button key='2' type='primary' onClick={e => this._handleOk(false)}>确认</Button>,
            <Button key='3' type='danger' onClick={e => this._handleOk(true)}>确认并且重启</Button>
          ]}
          onOk={this._handleOk}
          onCancel={this._handleCancle}
          visible={this.state.visible}
        >
          <strong>此操作会修改环境变量，重启{this.state.type}才会生效！</strong><br />
          <p style={{ marginTop: 24 }}><strong>{constants.APMENABLE_KEY[0]}</strong>:{this.state.APM_URL}</p>
          <p> <strong>{constants.APMENABLE_KEY[1]}</strong>:{this.state.config}</p>
        </Modal>

        <Modal
          title='确认删除？'
          footer={[
            <Button type='danger' loading={this.state.deleteLoading} onClick={this.handleOk}>确认</Button>,
          ]}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          visible={this.state.visibleDel}
        >
          <p>您要删除的{this.state.type}是：<span style={{ color: 'red' }}>{this.state.name}</span></p>
          {this.state.type === '中间件' && <p>与此中间件关联的应用是：<strong>{this.state.appNames}</strong></p>}
          <p>删除{this.state.type}时，{this.state.type}相关的所有资源都会被删除，此操作不能够撤销 !</p>
          <p>{this.state.type}code: <strong>{this.props.appCode}</strong> </p>
          <Input style={{ marginTop: 12, width: 300 }} placeholder='请填写上方的应用CODE' value={this.state.key} onChange={e => this.confirmInput(e)} />
          {this.state.hasVolumes &&
            <Checkbox style={{ marginTop: 16 }} onChange={(e) => this.setState({ isDeleteVolumes: e.target.checked })}>是否删除{this.state.type}挂载存储卷</Checkbox>}
        </Modal>
        <ClusterSelectModal
          visible={this.state.clusterVisible}
          clusterName={deployInfo.clusterName}
          clusterId={deployInfo.clusterId}
          onOk={this.clusterOnOk}
          onCancel={this.clusterOnCancel}
        />
      </div>
    )
  }
}

export default ErrorComponentCatch(AppSetting);