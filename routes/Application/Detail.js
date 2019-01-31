import React from 'react'
import PageHeader from 'ant-design-pro/lib/PageHeader';
import DescriptionList from 'ant-design-pro/lib/DescriptionList';
import  {Icon, Button, Row, Col, Spin, message, Card, Badge, Tag, Tooltip, InputNumber,Input } from 'antd';
import AppOverview from './Overview'
import AppDeploy from './Deploy'
import AppRunning from './Running'
import AppApi from './Api'
import AppLog from './Log'
import AppMenus from './Menus'
import AppSetting from './Setting'
import { Route } from 'react-router-dom';
import moment from 'moment';
import { getInstanceInfo, changeAppCluster, changeAppExtention, appStop, appStart, isEnvChanged, appStateCheck } from '../../services/cce'
import InputInline from '../../common/Input';
import TagManager from '../../common/TagManager';
import { getUserInfos } from '../../services/uop';
import UserSelectModal from '../../common/UserSelectModal';
import Transaction from '../../components/Application/Overview/Transaction';
import constants from '../../services/constants'
import { base } from '../../services/base'
import { checkIdName, getAppInfo, changeAppProperty, getAppManager, changeAppManager, getAppsTags, createAppTags, getAppTags, addAppTag, removeAppTag, updateApp } from '../../services/aip'
import '../../assets/fonts/iconfont.css';
import ClusterSelectModal from '../../common/ClusterSelectModal';
import Authorized from '../../common/Authorized';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';

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
      tabList: [],
      clusterVisible: false,
      clusterId: '',
      isEditNumber: false,
      replicasLoading: false,
      visible: false,
      history: this.props.history,
      appId: this.props.match.params.id,
      edit:false,
      //检查是否有未生效环境变量
      envChange: (isChanged) => {
        this.state.tabList.forEach(tab => {
          if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
        })
        this.setState({ tabList: this.state.tabList });
      }
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
      info.host = data.host;
      if(data.ctx ){
        if( data.ctx.substring(0, 1) === "/"){
          info.ctx = data.ctx;
        }else{
          info.ctx = "/" + data.ctx;
        } 
      }else{
        info.ctx = "/";
      }
      
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
      info.tabList.push({ key: 'overview', tab: '概览', path: `/${info.basePath}/:id/overview`, resourceId: `${info.basePath}_overview`, render: <AppOverview deployMode={data.deployMode} appCode={data.code} appId={this.appid} history={this.props.history} /> })
      this.setState({ deployMode: data.deployMode,code:data.code })
      //根据应用是否是k8s部署，查看部署页签
      if (info.deployMode === 'k8s' && info.code && base.configs.passEnabled) {
        info.tabList.push(
          { key: 'deploy', tab: '部署', resourceId: `${info.basePath}_deploy`, path: `/${info.basePath}/:id/deploy`, render: <AppDeploy appId={this.appid} envChange={this.envChange} /> });
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
            this.inputRelicas = info2.replicas;
            info2.status = response.status;
            info2.clusterId = response.clusterId;
            this.setState(info2);
            //监听应用状态
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
          { key: 'running', tab: '访问&认证', resourceId: 'apps_running', path: `/${info.basePath}/:id/running`, component: AppRunning },
          { key: 'resource', tab: '权限', resourceId: 'apps_resource', path: `/${info.basePath}/:id/resource`, render: <AppMenus upstream={this.upstream} {...this.props} appname={info.appname} />},
          { key: 'api', tab: '服务', resourceId: 'apps_api', path: "/apps/:id/api", render: <AppApi upstream={this.upstream} {...this.props} appCode={this.state.code} /> }
        );
      } else {
        info.appTypeName = '中间件';
      }
      //if (info.deployMode === 'k8s' && info.code) {
        info.tabList.push({ key: 'log', tab: '日志', resourceId: `${info.basePath}_log`, path: `/${info.basePath}/:id/log`, render:<AppLog deployMode={info.deployMode} {...this.props} appCode={this.state.code}/> });
      //}
      if (info.apm) info.tabList.push({ key: 'transaction', tab: '性能监控', path: `/${info.basePath}/:id/transaction`, render: <Card style={{ margin: 24 }} bodyStyle={{ padding: '24px 8px 0px 8px' }} ><Transaction appCode={this.state.code} /></Card> });
      info.tabList.push({ key: 'setting', tab: '设置', resourceId: `${info.basePath}_setting`, path: `/${info.basePath}/:id/setting`, render: <AppSetting appId={this.appid} appCode={this.state.code} history={this.props.history} /> });

      let newAry = [];
      info.tabList.forEach((t, i) => {
        if (!t.resourceId||base.allpermissions.includes(t.resourceId)) {
          newAry.push(t)
        }
        if (this.pathname.indexOf(t.key) > 0) info.tabActiveKey = t.key;
      })
      info.tabList = newAry;
      this.setState(info);
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

  envChange = (isChanged) => {
    this.state.tabList.forEach(tab => {
      if (tab.key === 'deploy') tab.tab = isChanged ? <Badge dot>部署</Badge> : '部署';
    })
    this.setState({ tabList: this.state.tabList });
  }

  //应用名称修改
  onAppNameChangeCommit(value) {
    return new Promise((resolve, reject) => {
      if (value && value !== this.state.appname) {
        var appname = this.state.appname;
        checkIdName({attr:value}, { attr: "name", tenant: base.tenant }).then(data => {
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
    
    changeAppProperty(this.appid, { name: this.state.appname, desc: value })
      .then((response) => {
        if(response){
          message.success('修改描述成功！');
          this.setState({
            description: value
          })
        }
      })
    
  }

  //标签弹窗管理可见回调
  onVisibleChange(visible) {
    if (visible) {
      getAppsTags()
        .then((response) => {
          this.setState({
            allTags: response,
            visible: true
          })
        })
    } else {
      this.setState({ visible: false })
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

  _onEditHostOk = () =>{
    updateApp(this.state.appId,{},{host:this.state.host}).then(res=>{
      message.success('修改访问地址成功！');
      this.setState({edit:false});
    })
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
    var manager = "";
    if (this.state.systemManager.length !== 0) {
      for (var i in this.state.systemManager) {
        if (i === this.state.systemManager.length - 1) {
          manager = manager + this.state.systemManager[i].userName;
        } else {
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
          {base.configs.passEnabled?<Description term="所属集群"> <Authorized authority={this.state.appTypeName === "中间件" ? 'middleware_migrate' : 'app_migrate'} noMatch={this.state.clusterName}><Tooltip title="点击迁移应用" onClick={this._clusterVisible}>{this.state.clusterName}</Tooltip></Authorized></Description>
          :""
          }
          {base.configs.passEnabled?
            <Description term="应用副本">
              {
                this.state.isEditNumber ?
                  <div><InputNumber min={1} max={5} defaultValue={this.state.replicas} onChange={this._setInputReplicas} />
                    <Button style={{ marginLeft: 8 }} type="primary" onClick={this._setReplicas} loading={this.state.replicasLoading}>确定</Button><Button style={{ marginLeft: 8 }} onClick={() => { this.setState({ isEditNumber: false }) }}>取消</Button></div>
                  :
                  <Authorized authority={this.state.type === "middleware"?"middlewares_edit":"app_edit"} noMatch={this.state.replicas}>
                    <Tooltip title="点击修改副本数" onClick={() => { if (!this.state.isEditNumber) { this.setState({ isEditNumber: true }) } }}>
                      {this.state.replicas}
                    </Tooltip>
                  </Authorized>

              }
            </Description>
              :""
            }
            <Description term='访问地址'>
              {this.state.edit?
                <span><Input style={{width:100}} value={this.state.host} onChange={e=>{this.setState({host:e.target.value})}}/>
                <Button style={{marginLeft:3}} type='primary' onClick={this._onEditHostOk}>确定</Button>
                <Button style={{marginLeft:3}} onClick={()=>{this.setState({edit:false})}} >取消</Button></span>:
               <span  style={{display:'-webkit-inline-box'}} className='hover-editor'>{this.state.host?
                <a  style={{width:200,display:'flex','overflowX':'hidden'}} href={this.state.host + this.state.ctx} target="_blank"> <Ellipsis lines={1} length={150} tooltip={true}>{this.state.host + this.state.ctx}</Ellipsis>
                </a>:'--'}<Icon style={{marginLeft:10}} type='edit' onClick={()=>{this.setState({edit:true})}}/></span>
              }
               
            </Description>
          {/* </Col> */}
        </DescriptionList>
        <DescriptionList size="small" col="1" style={{ marginTop:10}}>
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
          <div className="ant-col-xs-24 ant-col-sm-24" style={{ paddingLeft: 16, paddingRight: 16}}><div className="antd-pro-description-list-term">特性</div>
            <div className="antd-pro-description-list-detail">
              {appFeature.map((f, index) => <Tag key={index} color={f.enable ? "geekblue" : ""}><i className={'icon ampicon ' + f.icon}></i><span style={{ paddingLeft: 5 }}>{f.name}</span></Tag>)}
            </div>
          </div>
          <Description>
            <InputInline title={'描述'} value={this.state.description} onChange={this.onAppDescriptionChangeCommit} dataType={'TextArea'} mode={'inline'} defaultNullValue={'空'} width={600} />
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
      <Authorized authority={this.state.type === "middleware"?"middlewares_edit":"app_edit"} noMatch={ 
      <InputInline
        title={this.state.appTypeName}
        onCommit={this.onAppNameChangeCommit}
        value={this.state.appname}
        dataType={'Input'}
        mode={'inline'}
        editing={false}
        defaultNullValue={'暂无'}
        rule={{ required: true }}
        renderExtraContent={() => {
          return (<TagManager style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />)
        }}
      />}>
          <InputInline
          title={this.state.appTypeName}
          onCommit={this.onAppNameChangeCommit}
          value={this.state.appname}
          dataType={'Input'}
          mode={'inline'}
          defaultNullValue={'暂无'}
          rule={{ required: true }}
          renderExtraContent={() => {
            return (<TagManager key={"testkeytetewt"} style={{ marginLeft: 10 }} visible={this.state.visible} selectedTags={this.state.tags} allTags={this.state.allTags} onChange={this.onTagsManagerChange} onVisibleChange={this.onVisibleChange} />)
          }}
        />
      </Authorized>
      
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
    let basePath = 'apps';
    let appTypeName = '应用';
    if(this.pathname.indexOf('middlewares')!==-1){
      basePath = 'middlewares';
      appTypeName = '中间件';
    }
    const breadcrumbList = [{title:appTypeName+'列表',href:'#/'+basePath},{title:'应用详情'}];
    return (
      <div style={{ margin: '-24px -24px 0' }}>
        <PageHeader
          title={this.renderTitle()}
          logo={<img alt='' src={this.state.type === "middleware" ? constants.PIC.middleware : constants.PIC.app} />}
          action={this.state.deployMode === 'k8s' && base.configs.passEnabled?
            (this.state.status === 'stop' ?
              <Authorized authority={this.state.type === "middleware" ? 'middleware_start' : 'app_start'} noMatch={<Button disabled="true" icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>}>
                <Button icon="caret-right" type="primary" loading={this.state.statusLoading} onClick={this.appStart}>启动</Button>
              </Authorized> :
              <Authorized authority={this.state.type === "middleware" ? 'middleware_stop' : 'app_stop'} noMatch={<Button disabled="true" icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>}>
                <Button icon="poweroff" loading={this.state.statusLoading} onClick={this.appStop} type="danger">停止</Button>
              </Authorized>) : ''}
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
        {this.state.tabList.length > 0 ?
          <div>
            {this.state.tabList.map((i,index) => {
              if (i.render) {
                return (
                  <Route key={index} path={i.path} render={props => i.render} />
                )
              } else if (i.component) {
                return (
                  <Route key={index} path={i.path} component={i.component} />
                )
              }else return '';
            })}
            {/* 默认选中第一个tap页 */}
            {this.state.tabList[0].render ?
              <Route path={`/${basePath}/:id`} render={props => this.state.tabList[0].render} exact />
              :
              <Route path={`/${basePath}/:id`} component={this.state.tabList[0].component} exact />}
          </div> : ''
        }
        {/* <Route path={`/${basePath}/:id`} test='123123' render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} exact />
        <Route path={`/${basePath}/:id/overview`} render={props => <AppOverview deployMode={this.state.deployMode} appCode={this.state.code} appId={this.appid} history={this.props.history} />} />
        <Route path={`/${basePath}/:id/deploy`} render={props => <AppDeploy appId={this.appid} envChange={this.envChange} />} />
        <Route path={`/${basePath}/:id/running`}test='123123' component={AppRunning} />
        <Route path={`/${basePath}/:id/resource`} component={AppMenus} />
        <Route path="/apps/:id/api" render={props => <AppApi {...props} upstream={this.upstream} />} />
        <Route path={`/${basePath}/:id/log`} component={AppLog} />
        <Route path={`/${basePath}/:id/transaction`} render={props => <Card style={{ margin: 24 }} bodyStyle={{ padding: '24px 8px 0px 8px' }} ><Transaction appCode={this.state.code} /></Card>} />
        <Route path={`/${basePath}/:id/setting`} render={props => <AppSetting appId={this.appid} appCode={this.state.code} history={this.props.history} />} />  */}
      </div>
    );
  }
}

export default AppDetail;