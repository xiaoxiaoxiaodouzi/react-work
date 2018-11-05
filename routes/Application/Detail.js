import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import { Button, Row, Col, Spin, message, Card, Badge, Tag, Divider, Tooltip, InputNumber } from 'antd';
import AppOverview from './Overview'
import AppDeploy from './Deploy'
import AppRunning from './Running'
import AppApi from './Api'
import AppLog from './Log'
import AppMenus from './Menus'
import AppSetting from './Setting'
import { Route } from 'react-router-dom';
import moment from 'moment';
import { getAppInfo, changeAppProperty, getAppTags, getAppsTags, getAppManager, changeAppManager, getInstanceInfo, createAppTags, addAppTag, removeAppTag, appStateCheck, appStop, appStart, isEnvChanged, changeAppCluster, changeAppExtention } from '../../services/appdetail'
import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import { getUserInfos } from '../../services/images';
import UserSelectModal from '../../common/UserSelectModal';
import Transaction from '../../components/Application/Overview/Transaction';
import constants from '../../services/constants'
import { base } from '../../services/base'
import { checkIdName } from '../../services/apps'
import '../../assets/fonts/iconfont.css';
import ClusterSelectModal from '../../common/ClusterSelectModal';
import RenderAuthorized  from 'ant-design-pro/lib/Authorized';

const { Description } = DescriptionList;
const InstanceStatus = constants.APP_STATE_CN;
const appStateRepeatTime = 5000;

//应用状态监听定时器
let appStateWatching;

class AppDetail extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      tabActiveKey: "overview",
      appname: '',
      username: '',
      avatar: "",
      status: 'unknown',
      replicas: 0,
      creationtime: moment(),
      clusterName: '--',
      description: '',
      code: '',
      tags: [],
      allTags: [],
      systemManager: [],
      businessManager: [],
      auditManager: [],
      appTypeName: '',
      statusLoading: false,
      deployMode: '',
      tabList: [{ key: 'overview', tab: '概览' }],
      clusterVisible: false,
      clusterId: '',
      isEditNumber: false,
      replicasLoading: false,
      visible:false

    }

    this.appid = props.match.params.id;
    this.pathname = props.location.pathname;
    this.code = '';
    this.inputRelicas = '';

    this.onAppNameChangeCommit = this.onAppNameChangeCommit.bind(this);
    this.onAppDescriptionChangeCommit = this.onAppDescriptionChangeCommit.bind(this);
    this.onVisibleChange = this.onVisibleChange.bind(this);
    this.onTagsManagerChange = this.onTagsManagerChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.id !== this.appid) {
      this.appid = nextProps.match.params.id;
      this.loadData();
    }
    if (nextProps.location.pathname !== this.props.location.pathname) {
      let tabs = nextProps.location.pathname.split(`${this.appid}/`);
      this.setState({ tabActiveKey: tabs[1] });
    }
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillUnmount() {
    //关闭应用状态监听
    if (appStateWatching) window.clearInterval(appStateWatching);
  }

  loadData = () => {
    getAppInfo(this.appid).then(data => {
      let info = {};
      info.appname = data.name;
      // info.avatar = response[0].icon;
      this.code = data.code
      info.code = data.code;
      info.type = data.type;
      info.basePath = info.type === 'middleware' ? 'middlewares' : 'apps';
      info.deployMode = data.deployMode;
      info.creationtime = moment(data.createtime);
      info.description = data.desc;
      info.apm = data.apm;
      info.acl = data.acl;
      info.springcloud = data.springcloud;
      info.ha = data.healthCheck && data.replicas && data.replicas > 1;
      info.isSysApp = data.id === "0";
      this.upstream = data.upstream;

      info.tabList = this.state.tabList.slice(0, 1);
      if (data.creator !== 'admin') {
        getUserInfos(data.creator).then(user => {
          info.username = user.name;
          this.setState(info);
        })
      } else {
        info.username = 'admin'
      }
      this.setState({ deployMode: data.deployMode })
      //根据应用是否是k8s部署，查看部署页签
      if (info.deployMode === 'k8s' && info.code) {
        info.tabList.push({ key: 'deploy', tab: '部署' });
        //检查是否有未生效环境变量
        isEnvChanged(info.code).then(data => {
          if (data) {
            this.state.tabList.forEach(tab => {
              if (tab.key === 'deploy') tab.tab = <Badge dot>部署</Badge>;
            })
            this.setState({ tabList: this.state.tabList });
          }
        });
        //获取部署信息
        getInstanceInfo(info.code).then((response) => {
          if (response === undefined) return;
          // this.state.tabList.splice(1,0,{ key: 'deploy', tab: '部署' });

          let info2 = {};
          info2.clusterName = response.clusterName;
          info2.replicas = response.replicas ? response.replicas : 0;
          info2.status = response.status;
          info2.clusterId = response.clusterId;
          this.setState(info2);
          //监听应用状态
          console.info("开始监听应用状态...");
          appStateWatching = window.setInterval(() => {
            appStateCheck(info.code).then(data => {
              if (data && data.additionalProperties.status !== this.state.status) {
                this.setState({ status: data.additionalProperties.status, statusLoading: false });
              }
            })
          }, appStateRepeatTime);
        });
      }
      //中间件类型的应用特殊处理
      if (info.type !== "middleware") {
        info.appTypeName = '应用';
        info.tabList.push(
          { key: 'running', tab: '认证' },
          { key: 'resource', tab: '权限' },
          { key: 'api', tab: '服务' }
        );
        if (info.deployMode === 'k8s' && info.code) {
          info.tabList.push({ key: 'log', tab: '日志' });
        }
      } else {
        info.appTypeName = '中间件';
      }

      if (info.apm) info.tabList.push({ key: 'transaction', tab: '事务' });
      info.tabList.push({ key: 'setting', tab: '设置' });

      info.tabList.forEach(t => {
        if (this.pathname.indexOf(t.key) > 0) info.tabActiveKey = t.key;
      })
      this.setState(info);
      //不需要业务管理员和审计管理员
      Promise.all([getAppTags(this.appid), getAppManager(this.appid, 'SYSTEM_MANAGER', this.code),])
        .then((response) => {
          var info = {};
          info.tags = response[0];
          var systemManager = [];
          response[1].forEach(element => {
            element.name = element.userName;
            systemManager.push(element)
          });

          info.systemManager = systemManager;

          this.setState(info);
        })
    });

  }

  //*************************************************************************** */
  //**********************************EVENT************************************ */
  //*************************************************************************** */
  onTabChange = (key) => {
    let { history } = this.props;
    let params = this.props.match.params;
    history.push({ pathname: `/${this.state.basePath}/${params.id}/${key}` });
    this.setState({ tabActiveKey: key });
  }
  //检查是否有未生效环境变量
  envChange = (isChanged) => {
    this.state.tabList.forEach(tab => {
      if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
    })
    this.setState({ tabList: this.state.tabList });
  }

  //应用名称修改
  onAppNameChangeCommit(value) {
    return new Promise((resolve, reject) => {
      if (value) {
        var appname = this.state.appname;
        checkIdName(value, { attr: "name", tenant: base.tenant }).then(data => {
          if (data) {
            message.error('应用名称已存在，请重新修改')
            reject();
          } else {
            changeAppProperty(this.appid, { name: value }).then(data => {
              message.success('应用名称修改成功')
              this.setState({
                appname: value
              })
              resolve();
            }).catch((e) => {
              resolve();
              this.setState({
                appname: appname
              })
            })
          }
        }).catch(err => {
          resolve();
        })
      } else {
        resolve();
      }
    })
  }

  //应用描述修改
  onAppDescriptionChangeCommit(value) {
    var description = this.state.description;
    this.setState({
      description: value
    })
    changeAppProperty(this.appid, { name: this.state.appname, desc: value })
      .then((response) => {

      })
      .catch((e) => {
        this.setState({
          desc: description
        })
      })
  }

  //标签弹窗管理可见回调
  onVisibleChange(visible) {
    if (visible) {
      getAppsTags()
        .then((response) => {
          this.setState({
            allTags: response,
            visible:true
          })
        })
    }else{
      this.setState({visible:false})
    }
  }

  // 标签变化回调  create创建新标签 add绑定已创建标签 remove移除标签{event:'add',value:{id:***,name:*****}}
  onTagsManagerChange(data) {
    var tag = data.value;
    console.log(base)
    tag.tenant = base.tenant;
    if (data.event === "add") {
      addAppTag(this.appid, tag)
        .then((response) => {
          var tags = this.state.tags.slice(0);
          tags.push(tag);
          this.setState({
            tags: tags
          })
        })
    } else if (data.event === 'create') {
      //创建绑定
      createAppTags(tag)
        .then((response) => {
          tag = response[0];
          return addAppTag(this.appid, tag)
        })
        .then((response) => {
          var tags = this.state.tags.slice(0);
          tags.push(tag);
          this.setState({
            tags: tags
          })
        })
    } else if (data.event === 'remove') {
      //移除标签
      removeAppTag(this.appid, tag.id)
        .then((response) => {
          var tags = this.state.tags;
          var tmptags = [];
          tags.forEach((element) => {
            if (element.id !== tag.id) {
              tmptags.push(element)
            }
          })
          this.setState({
            tags: tmptags
          })
        })
    }
  }

  _onManagerChange(type, users) {
    var usersId = [];
    users.forEach((element) => {
      usersId.push(element.id);
    })
    changeAppManager(this.appid, type, usersId)
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
        } else if ('AUDIT_MANAGER') {
          this.setState({
            auditManager: users
          })
        }
      })
      .catch((e) => {

      })
  }
  _clusterVisible = () => {
    this.setState({
      clusterVisible: true
    });
  }
  _setReplicas = () => {

    this.setState({
      replicasLoading: true
    })
    changeAppExtention(this.code, this.inputRelicas).then(data => {
      if (data) {
        this.setState({
          isEditNumber: false,
          replicas: this.inputRelicas
        })
      }
      this.setState({
        replicasLoading: false
      })
    }).catch(err => {
      this.setState({
        replicasLoading: false
      })
    })

  }

  _setInputReplicas = (value) => {
    this.inputRelicas = value;
  }
  //*************************************************************************** */
  //************************************UI************************************* */
  //*************************************************************************** */
  renderExtra() {
    return (
      <Row>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>实例数</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.replicas}</div>
        </Col>
        <Col sm={24} md={12}>
          <div style={{ color: 'rgba(0, 0, 0, 0.43)' }}>状态</div>
          <div style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 20 }}>{this.state.status === 'running' || this.state.status === 'pending' ? <span><Spin size="small" style={{ marginRight: 5 }} />{InstanceStatus[this.state.status]}</span> : InstanceStatus[this.state.status]}</div>
        </Col>
      </Row>
    )
  }

  renderconstDescription() {
    const Authorized = RenderAuthorized(base.allpermissions);
    var manager = "";
    if(this.state.systemManager.length !== 0){
      for(var i in this.state.systemManager){
          if(i === this.state.systemManager.length - 1){
            manager = manager + this.state.systemManager[i].userName;
          }else{
            manager = manager + this.state.systemManager[i].userName + ',';
          }
      }
    }
    let appFeature = [{ name: this.state.type, enable: this.state.type, icon: 'icon-' + this.state.type }, { name: "系统应用", enable: this.state.isSysApp }, { name: "统一认证", enable: this.state.acl, icon: 'icon-auth' }, { name: "SpringCloud", enable: this.state.springcloud, icon: 'icon-framework' }, { name: "性能监控", enable: this.state.apm, icon: 'icon-apm' }, { name: "高可用", enable: this.state.ha, icon: 'icon-ha' }];
    return (
      <div>

        <DescriptionList size="small" col="2">
          <Description term="创建人">{this.state.username}</Description>
          <Description term="创建时间">{this.state.creationtime ? this.state.creationtime.format("YYYY-MM-DD HH:mm:ss") : null}</Description>
          <Description term="CODE">{this.state.code}</Description>
          <Description term="所属集群"> <Authorized authority={this.state.appTypeName==="中间件"?'middleware_migrate':'app_migrate'} noMatch={this.state.clusterName}><Tooltip title="点击迁移应用" onClick={this._clusterVisible}>{this.state.clusterName}</Tooltip></Authorized></Description>
          <Col span={24}>
            <Description term="应用副本">
              {
                this.state.isEditNumber ?
                  <div><InputNumber min={1} max={5} defaultValue={this.state.replicas} onChange={this._setInputReplicas} />
                    <Button style={{ marginLeft: 8 }} type="primary" onClick={this._setReplicas} loading={this.state.replicasLoading}>确定</Button><Button style={{ marginLeft: 8 }} onClick={() => { this.setState({ isEditNumber: false }) }}>取消</Button></div>
                  :
                  <Tooltip title="点击修改副本数" onClick={() => { if (!this.state.isEditNumber) { this.setState({ isEditNumber: true }) } }}>
                    {this.state.replicas}
                  </Tooltip>

              }

            </Description>
          </Col>
        </DescriptionList>
        <DescriptionList size="small" col="1">
          <Description term="系统管理员">
            <Authorized authority={this.state.appTypeName==="中间件"?'moddleware_managerSetting':'app_managerSetting'} noMatch={this.state.systemManager.length === 0?'未指定':manager}>
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
          {/* <Description term="业务管理员">
          <UserSelectModal 
            title={'设置业务管理员'}
            mark='业务管理员'
            description=''
            selectedUsers={this.state.businessManager} 
            dataIndex={{ dataIdIndex: 'USERID', dataNameIndex: 'userName' }} 
            onOk={(users) => { this._onManagerChange('BUSINESS_MANAGER', users) }} />
        </Description>
        <Description term="审计管理员">
          <UserSelectModal 
            title={'设置审计管理员'}
            mark='审计管理员'
            description=''
            selectedUsers={this.state.auditManager} 
            dataIndex={{ dataIdIndex: 'USERID', dataNameIndex: 'userName' }}
            onOk={(users) => { this._onManagerChange('AUDIT_MANAGER', users) }} />
        </Description> */}
          <div className="ant-col-xs-24 ant-col-sm-24" style={{ paddingLeft: 16, paddingRight: 16 }}><div className="antd-pro-description-list-term">特性</div>
            <div className="antd-pro-description-list-detail">
              {appFeature.map((f, index) => <Tag key={index} color={f.enable ? "geekblue" : ""}><i className={'icon ampicon ' + f.icon}></i><span style={{ paddingLeft: 5 }}>{f.name}</span></Tag>)}
            </div>
          </div>
          <Description>
            <InputInline title={'描述'} value={this.state.description} onChange={this.onAppDescriptionChangeCommit} dataType={'TextArea'} mode={'inline'} defaultNullValue={'空'} length={500} />
          </Description>
        </DescriptionList>
      </div>
    )
  };

  renderTitle() {
    // return (
    //   <div style={{ display: 'flex', height: 'auto' }}>
    //     <InputTag title={this.state.appTypeName} value={this.state.appname} onChange={this.onAppNameChangeCommit} dataType={'Input'} mode={'inline'} defaultNullValue={'暂无'} rule={{ required: true }} selectedTags={this.state.tags} allTags={this.state.allTags} onVisibleChange={() => null} onTagChange={this._onTagsManagerChange}/>
    //   </div>
    // )
    return (
      <InputInline
        title={this.state.appTypeName}
        onCommit={this.onAppNameChangeCommit}
        value={this.state.appname}
        dataType={'Input'}
        mode={'inline'}
        defaultNullValue={'暂无'}
        rule={{ required: true }}
        renderExtraContent={() => {
          return (<TagManager style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange}/>)
        }}
      />
    )
  }

  appStart = e => {
    this.setState({ statusLoading: true });
    appStart(this.state.code).then(() => {
      message.info('应用启动中...');
    })
  }

  appStop = e => {
    this.setState({ statusLoading: true });
    appStop(this.state.code).then(() => {
      message.info('正在停止应用');
    });
  }

  clusterOnOk = (cluster, clusterName, th) => {

    if (cluster) {
      changeAppCluster(this.code, cluster).then(data => {
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

  render() {
    const Authorized = RenderAuthorized(base.allpermissions);
    const basePath = this.state.basePath;
    let breadcrumbList;
    if (basePath) {
      breadcrumbList = [{
        title: <span><Divider type="vertical" style={{ width: "2px", height: "15px", backgroundColor: "#15469a", "verticalAlign": "text-bottom" }} /> {this.state.appTypeName + '列表'}</span>,
        href: '/#/' + basePath
      }, {
        title: this.state.appTypeName + '详情'
      }];
      // breadcrumbList = <Breadcrumb style={{marginTop:6}}>
      // <Breadcrumb.Item>
      // <Divider type="vertical"  style={{width:"2px",height:"15px",backgroundColor:"#15469a","verticalAlign":"text-bottom"}}/> 
      //   <a href={'/#/' + basePath}>{this.state.appTypeName + '列表'}</a></Breadcrumb.Item>
      // <Breadcrumb.Item>{this.state.appTypeName + '详情'}</Breadcrumb.Item>
      // </Breadcrumb>;
    }
    return (
      
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt='' src={this.state.type === "middleware" ? constants.PIC.middleware : constants.PIC.app} />}
          action={this.state.deployMode === 'k8s' ? (this.state.status === 'stop' ? <Authorized authority={this.state.appTypeName==="中间件"?'middleware_start':'app_start'} noMatch={<Button disabled="true" icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>}><Button icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button></Authorized> :  <Authorized authority={this.state.appTypeName==="中间件"?'middleware_stop':'app_stop'} noMatch={<Button disabled="true" icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>}><Button icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button></Authorized>) : ''}
          content={this.renderconstDescription()}
          extraContent={this.renderExtra()}
          breadcrumbList={breadcrumbList}
          tabList={this.state.tabList}
          tabActiveKey={this.state.tabActiveKey}
          onTabChange={this.onTabChange}
        />
        <ClusterSelectModal
          visible={this.state.clusterVisible}
          clusterName={this.state.clusterName}
          clusterId={this.state.clusterId}
          onOk={this.clusterOnOk}
          onCancel={this.clusterOnCancel}
        />
        {/* <Redirect from={`/${basePath}/:id`} to={`/${basePath}/:id/overview`} exact push={false} /> */}
        <Route path={`/${basePath}/:id`} render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} exact />
        <Route path={`/${basePath}/:id/overview`} render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} />
        <Route path={`/${basePath}/:id/deploy`} render={props => <AppDeploy appId={this.appid} envChange={this.envChange} />} />
        <Route path={`/${basePath}/:id/running`} component={AppRunning} />
        <Route path={`/${basePath}/:id/resource`} component={AppMenus} />
        <Route path="/apps/:id/api" render={props => <AppApi {...props} upstream={this.upstream} />} />
        <Route path={`/${basePath}/:id/log`} component={AppLog} />
        <Route path={`/${basePath}/:id/transaction`} render={props => <Card style={{ margin: 24 }} bodyStyle={{ padding: '24px 8px 0px 8px' }} ><Transaction appCode={this.state.code} /></Card>} />
        <Route path={`/${basePath}/:id/setting`} render={props => <AppSetting appId={this.appid} appCode={this.state.code} history={this.props.history} />} />
      </div>
    );
  }
}

export default AppDetail;